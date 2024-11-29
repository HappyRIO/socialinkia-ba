const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../../model/User.js");
const crypto = require("crypto");
const qs = require("qs");
const isSessionValid = require("../../middleware/isSessionValid.js");
require("dotenv").config();

// Utility function to generate random strings
const generateRandomString = (length = 16) =>
  crypto.randomBytes(length).toString("hex");

// Step 1: Redirect to Instagram for authorization
router.get("/auth/instagram", isSessionValid, async (req, res) => {
  console.log("Firing Instagram auth");

  const instagramClientId = process.env.INSTAGRAM_CLIENT_ID;
  const instagramRedirectUri = process.env.INSTAGRAM_REDIRECT_URI;

  if (!instagramClientId || !instagramRedirectUri) {
    return res.status(500).send("Instagram Client ID or Redirect URI not set.");
  }

  const randomState = generateRandomString();
  const scope = `instagram_basic,instagram_manage_comments,instagram_manage_insights,instagram_manage_messages,instagram_content_publish,pages_read_engagement,pages_manage_posts,business_management`;

  let instagramAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${instagramClientId}&redirect_uri=${instagramRedirectUri}&state=${randomState}&scope=${scope}`;

  if (req.user?.instagramAccessToken) {
    // Reauthenticate if user already has a token
    console.log("Reauthenticating Instagram user...");
    instagramAuthUrl += "&auth_type=rerequest&prompt=consent";
  } else {
    console.log("Authenticating new Instagram user...");
  }

  res.redirect(instagramAuthUrl);
});

// Step 2: Handle Instagram OAuth callback
router.get("/auth/instagram/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  try {
    const payload = {
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
      code,
    };

    console.log("Payload for token exchange:", payload);

    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      qs.stringify(payload),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, user_id } = tokenResponse.data;
    console.log("Access token received:", access_token);

    // Check if the user exists in the database
    let user = await User.findOne({ instagramId: user_id });

    if (user) {
      console.log("Existing Instagram user detected. Updating access token...");
      user.instagramAccessToken = access_token;
      user.instagramTokenExpiry = new Date(
        Date.now() + 60 * 24 * 60 * 60 * 1000 // 60 days
      );
    } else {
      console.log("New Instagram user detected. Creating user record...");

      // Fetch Instagram user info
      const userInfoResponse = await axios.get(
        `https://graph.instagram.com/me?fields=id,username,email&access_token=${access_token}`
      );
      const userInfo = userInfoResponse.data;
      console.log("User info:", userInfo);

      user = new User({
        instagramId: user_id,
        instagramAccessToken: access_token,
        instagramTokenExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        email: userInfo.email || null,
      });
    }

    await user.save();

    // Fetch Instagram business accounts
    const accountsResponse = await axios.get(
      `https://graph.facebook.com/v17.0/${user_id}/accounts?access_token=${access_token}`
    );
    const accounts = accountsResponse.data.data;

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({
        message: "No Instagram business accounts found.",
      });
    }

    res.json({
      message: "Select an Instagram business account to continue",
      accounts,
    });
  } catch (error) {
    console.error("Error during Instagram OAuth callback:", error.message);

    if (
      error.response?.data?.error?.message ===
      "This authorization code has been used."
    ) {
      console.error(
        "Authorization code already used. Redirecting to restart OAuth."
      );
      return res.redirect("/auth/instagram");
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
