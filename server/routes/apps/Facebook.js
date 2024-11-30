const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../../model/User.js");
const crypto = require("crypto");
const qs = require("qs");
const isSessionValid = require("../../middleware/isSessionValid.js");
require("dotenv").config();

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
  const facebookAppId = process.env.FACEBOOK_APP_ID;
  const facebookRedirectUri = process.env.FACEBOOK_REDIRECT_URI;

  if (!facebookAppId || !facebookRedirectUri) {
    return res.status(500).send("Facebook App ID or Redirect URI not set.");
  }

  const randomString = generateRandomString();
  const scope =
    "email,public_profile,pages_manage_posts,pages_read_engagement,pages_manage_metadata";
  let facebookAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${facebookRedirectUri}&state=${randomString}&scope=${scope}`;

  if (req.user?.facebookAccessToken) {
    // Reauthenticate if user already has a token
    console.log("Reauthenticating user...");
    facebookAuthUrl += "&auth_type=rerequest&prompt=consent";
  } else {
    console.log("Authenticating new user...");
  }

  res.redirect(facebookAuthUrl);
});

// Step 2: Handle Facebook OAuth callback
router.get("/auth/facebook/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  try {
    // Exchange the code for an access token
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

    const { access_token, expires_in } = tokenResponse.data;

    console.log("Access token received:", access_token);

    // Calculate token expiry
    const tokenExpiryDate = expires_in
      ? new Date(Date.now() + expires_in * 1000)
      : null;

    if (!access_token) {
      throw new Error("Failed to retrieve access token.");
    }

    // Fetch Facebook user profile with email
    const profileResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,email,name&access_token=${access_token}`
    );
    const profileData = profileResponse.data;

    if (!profileData.id || !profileData.email) {
      throw new Error("Failed to retrieve Facebook user profile or email.");
    }

    // Check if the user exists by Facebook ID
    let user = await User.findOne({ facebookId: profileData.id });

    if (user) {
      console.log("Existing user detected. Updating access token...");
      user.facebookAccessToken = access_token;
      user.facebookTokenExpiry = tokenExpiryDate;
    } else {
      // Check if the user exists by email
      user = await User.findOne({ email: profileData.email });

      if (user) {
        console.log(
          "Existing user detected by email. Associating Facebook account..."
        );
        user.facebookId = profileData.id;
        user.facebookAccessToken = access_token;
        user.facebookTokenExpiry = tokenExpiryDate;
      } else {
        console.log("New user detected. Creating user record...");
        user = new User({
          facebookId: profileData.id,
          email: profileData.email,
          facebookAccessToken: access_token,
          facebookTokenExpiry: tokenExpiryDate,
        });
      }
    }

    await user.save();

    // Fetch user's Facebook pages
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/me/accounts?access_token=${access_token}`
    );
    const pagesData = pagesResponse.data;

    if (!pagesData.data || pagesData.data.length === 0) {
      return res.status(404).send("No pages found.");
    }

    res.json({ message: "Select a page to continue", pages: pagesData.data });
  } catch (error) {
    console.error("Error during Facebook OAuth callback:", error.message);

    if (error.response?.data?.error?.error_subcode === 36009) {
      console.error(
        "Authorization code already used. Redirecting to restart OAuth."
      );
      return res.redirect("/auth/facebook");
    }

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
