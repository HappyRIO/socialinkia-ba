const express = require("express");
const qs = require("qs");
const axios = require("axios");
const router = express.Router();
const User = require("../../model/User.js");
const isSessionValid = require("../../middleware/isSessionValid.js");

// Function to generate a random string (security purpose)
const generateRandomString = (length = 32) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};

// ----------------- Facebook Authentication ------------------
// Step 1: Redirect to Facebook for authorization
router.get("/auth/facebook", isSessionValid, async (req, res) => {
  console.log(req.user._id);
  const facebookAppId = process.env.FACEBOOK_APP_ID;
  const facebookRedirectUri = process.env.FACEBOOK_REDIRECT_URI;

  console.log({ fbaccess: req.user.facebookAccessToken });

  if (req.user.facebookAccessToken === "") {
    console.log({ message: "autheticating new user" });
    if (!facebookAppId || !facebookRedirectUri) {
      return res.status(500).send("Facebook App ID or Redirect URI not set.");
    }

    const randomString = generateRandomString();
    const facebookAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${facebookRedirectUri}&state=${randomString}&scope=email,public_profile,pages_manage_posts,pages_read_engagement,pages_manage_metadata`;

    res.redirect(facebookAuthUrl);
  } else {
    console.log({ message: "reautheticating  user" });

    if (!facebookAppId || !facebookRedirectUri) {
      return res.status(500).send("Facebook App ID or Redirect URI not set.");
    }

    const randomString = generateRandomString();
    const facebookAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${facebookRedirectUri}&state=${randomString}&scope=email,public_profile,pages_manage_posts,pages_read_engagement,pages_manage_metadata&auth_type=rerequest`;

    res.redirect(facebookAuthUrl);
  }
});

// Step 2: Handle Facebook OAuth callback
router.get("/auth/facebook/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  console.log({
    client_id: process.env.FACEBOOK_APP_ID,
    client_secret: process.env.FACEBOOK_APP_SECRET,
    redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
    code,
  });

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://graph.facebook.com/v17.0/oauth/access_token",
      qs.stringify({
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, expires_in, token_type } = tokenResponse.data;
    console.log({ tokenResponse: access_token, exp: expires_in });
    console.log("Token response data:", tokenResponse.data);

    // Determine token expiry date
    let tokenExpiryDate = null;
    if (expires_in) {
      tokenExpiryDate = new Date(Date.now() + expires_in * 1000);
    } else if (token_type === "bearer") {
      console.log("Long-lived token detected. Setting expiry to 60 days.");
      tokenExpiryDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days
    }

    // Fetch user profile to get Facebook ID
    const profileResponse = await axios.get(
      `https://graph.facebook.com/me?access_token=${access_token}`
    );
    const profileData = profileResponse.data;

    console.log("profile fetching");

    if (!profileData.id) {
      return res.status(500).send("Failed to obtain user profile.");
    }

    // Refresh or validate token for returning users
    const user = await User.findOne({ facebookId: profileData.id });

    if (user) {
      const isTokenExpired =
        Date.now() > new Date(user.facebookTokenExpiry).getTime();

      if (isTokenExpired) {
        console.log("Refreshing token for returning user.");
        const refreshResponse = await axios.get(
          `https://graph.facebook.com/v17.0/oauth/access_token`,
          {
            params: {
              grant_type: "fb_exchange_token",
              client_id: process.env.FACEBOOK_APP_ID,
              client_secret: process.env.FACEBOOK_APP_SECRET,
              fb_exchange_token: user.facebookAccessToken,
            },
          }
        );

        user.facebookAccessToken = refreshResponse.data.access_token;
        user.facebookTokenExpiry = new Date(
          Date.now() + refreshResponse.data.expires_in * 1000
        );
        await user.save();
      } else {
        console.log("Token is valid for returning user.");
      }
    } else {
      // Save new user's Facebook credentials to the database
      console.log("Saving new user to the database.");

      await User.findOneAndUpdate(
        { facebookId: profileData.id },
        {
          facebookId: profileData.id,
          facebookAccessToken: access_token,
          facebookTokenExpiry: tokenExpiryDate,
          // Remove insagramId from the update object if not relevant
        },
        { upsert: true, new: true }
      );
    }

    // Fetch user pages
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/me/accounts?access_token=${access_token}`
    );
    console.log("processing page list");
    const pagesData = pagesResponse.data;

    if (!pagesData.data || pagesData.data.length === 0) {
      return res.status(404).send("No pages found.");
    }

    res.json({ message: "Select a page to continue", pages: pagesData.data });
  } catch (error) {
    if (
      error.response?.data?.error?.code === 100 &&
      error.response?.data?.error?.error_subcode === 36009
    ) {
      console.error(
        "Authorization code already used. Prompting re-authentication."
      );
      return res.redirect("/auth/facebook");
    }
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    console.error("Error during Facebook OAuth callback:", error.message);
    res.status(500).send("An error occurred during authentication.");
  }
});

// Handle page selection
router.post("/select-page", async (req, res) => {
  console.log("page selection..........");
  const { userId, pageId, pageName, pageAccessToken } = req.body;

  if (!userId || !pageId) {
    return res.status(400).send("User ID and page ID are required.");
  }

  try {
    // Update the user with the selected page
    const user = await User.findByIdAndUpdate(
      userId,
      {
        selectedFacebookBusinessPage: {
          id: pageId,
          name: pageName,
          accessToken: pageAccessToken,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.json({ message: "Page selected successfully", user });
  } catch (error) {
    console.error("Error selecting page:", error);
    res.status(500).send("An error occurred while selecting the page.");
  }
});

// Middleware: Validate and refresh access token
const validateAndRefreshToken = async (req, res, next) => {
  const { userId } = req.body; // Assuming the userId is sent with the request

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const user = await User.findById(userId);

    if (!user || !user.facebookAccessToken) {
      return res.status(401).json({ error: "No access token found for user." });
    }

    const isTokenExpired =
      Date.now() > new Date(user.facebookTokenExpiry).getTime();

    if (isTokenExpired) {
      // Refresh the access token
      const refreshResponse = await axios.get(
        `https://graph.facebook.com/v17.0/oauth/access_token`,
        {
          params: {
            grant_type: "fb_exchange_token",
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            fb_exchange_token: user.facebookAccessToken,
          },
        }
      );

      user.facebookAccessToken = refreshResponse.data.access_token;
      user.facebookTokenExpiry = new Date(
        Date.now() + refreshResponse.data.expires_in * 1000
      );

      await user.save();
    }

    // Attach the access token to the request object
    req.facebookAccessToken = user.facebookAccessToken;
    next();
  } catch (error) {
    console.error("Error refreshing access token:", error.message);
    return res.status(500).json({ error: "Failed to refresh access token." });
  }
};

// ------------------ Posting to Facebook -------------------
router.post("/post", validateAndRefreshToken, async (req, res) => {
  const { message, images } = req.body;

  if (!message && (!images || images.length === 0)) {
    return res
      .status(400)
      .json({ error: "Message or at least one image URL is required." });
  }

  try {
    // Post the content
    const postResponse = await axios.post(
      `https://graph.facebook.com/v17.0/me/feed`,
      {
        access_token: req.facebookAccessToken,
        message,
      }
    );

    const postId = postResponse.data.id;

    if (images && images.length > 0) {
      // Upload images to the post
      const imageUploadPromises = images.map((imageUrl) =>
        axios.post(`https://graph.facebook.com/v17.0/${postId}/photos`, {
          access_token: req.facebookAccessToken,
          url: imageUrl,
          published: false,
        })
      );

      await Promise.all(imageUploadPromises);
    }

    res.json({
      message: "Content with multiple images posted successfully!",
      postId,
    });
  } catch (error) {
    console.error("Error posting to Facebook:", error.message);
    res.status(500).json({ error: "Failed to post content on Facebook." });
  }
});

// Fetch user's posts
router.get("/posts", validateAndRefreshToken, async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/me/posts?access_token=${req.facebookAccessToken}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Fetch insights for a specific post
router.get("/posts/:id/insights", validateAndRefreshToken, async (req, res) => {
  const postId = req.params.id;

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/${postId}/insights?access_token=${req.facebookAccessToken}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching post insights:", error.message);
    res.status(500).json({ error: "Failed to fetch post insights" });
  }
});

module.exports = router;
