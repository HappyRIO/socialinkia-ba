const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

// ----------------- Instagram Authentication ------------------
// Step 1: Redirect to Instagram for authorization
router.get("/auth/instagram", (req, res) => {
  console.log("firing inst auth");
  const teststring =
    "https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=3470054769957639&redirect_uri=https://auto-social-api.onrender.com/api/instagram/auth/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish";
  const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish`;
  res.redirect(instagramAuthUrl);
});
// ----------------- Content Management Routes ------------------

// Step 2: Handle Instagram OAuth callback
router.get("/auth/instagram/callback", async (req, res) => {
  console.log("ig call back");
  const { code } = req.query;
  console.log(code);

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  try {
    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      {
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code,
      }
    );

    const { access_token, user_id } = tokenResponse.data;

    // Fetch the long-lived access token
    const longLivedTokenResponse = await axios.get(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_id=${process.env.INSTAGRAM_CLIENT_ID}&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&short_lived_token=${access_token}`
    );

    const longLivedAccessToken = longLivedTokenResponse.data.access_token;

    // Fetch user profile information
    const userResponse = await axios.get(
      `https://graph.instagram.com/${user_id}?fields=id,username,name,account_type,media_count&access_token=${longLivedAccessToken}`
    );
    const userProfile = userResponse.data;

    req.session.accessToken = longLivedAccessToken;
    req.session.instagramUser = userProfile;

    console.log({
      message: "Instagram account connected successfully!",
      userProfile,
    });
    res.json({
      message: "Instagram account connected successfully!",
      userProfile,
    });
  } catch (error) {
    console.error("Error exchanging code for token:", error.message);
    res.status(500).send("OAuth Authentication failed");
  }
});

// Middleware to check token validity and refresh if necessary
const validateAndRefreshToken = async (req, res, next) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: "No access token found." });
  }

  const isTokenExpired = (expiry) => Date.now() > expiry;
  if (isTokenExpired(req.session.tokenExpiry)) {
    try {
      const response = await axios.get(
        "https://graph.instagram.com/refresh_access_token",
        {
          params: {
            grant_type: "ig_refresh_token",
            access_token: req.session.accessToken,
          },
        }
      );

      req.session.accessToken = response.data.access_token;
      req.session.tokenExpiry = Date.now() + response.data.expires_in * 1000; // Ensure this is correctly set when initializing
      console.log("Access token refreshed successfully.");
    } catch (error) {
      console.error("Error refreshing access token:", error.message);
      return res.status(500).json({ error: "Failed to refresh access token." });
    }
  }

  next();
};

router.get("/all", validateAndRefreshToken, async (req, res) => {
  res.json({ message: "res confirmed" });
});

// Route to publish content on Instagram
router.post("/post", validateAndRefreshToken, async (req, res) => {
  const { caption, imageUrl } = req.body; // Accept caption and image URL as input

  if (!caption || !imageUrl) {
    return res
      .status(400)
      .json({ error: "Caption and image URL are required." });
  }

  try {
    // Step 1: Create media container
    const mediaContainerResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.INSTAGRAM_USER_ID}/media`,
      {
        image_url: imageUrl,
        caption: caption,
        access_token: req.session.accessToken,
      }
    );

    const { id: mediaContainerId } = mediaContainerResponse.data;

    // Step 2: Publish media
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.INSTAGRAM_USER_ID}/media_publish`,
      {
        creation_id: mediaContainerId,
        access_token: req.session.accessToken,
      }
    );

    res.status(200).json({
      message: "Content posted successfully!",
      postId: publishResponse.data.id,
    });
  } catch (error) {
    console.error("Error posting content on Instagram:", error.message);
    res.status(500).json({ error: "Failed to post content on Instagram." });
  }
});

// get posts
router.get("/user/media", validateAndRefreshToken, async (req, res) => {
  try {
    const mediaResponse = await axios.get(
      `https://graph.instagram.com/me/media`,
      {
        params: {
          fields:
            "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
          access_token: req.session.accessToken,
        },
      }
    );

    res.status(200).json({
      message: "User media retrieved successfully!",
      media: mediaResponse.data.data,
    });
  } catch (error) {
    console.error("Error retrieving user media:", error.message);
    res.status(500).json({ error: "Failed to retrieve user media." });
  }
});

router.get(
  "/post/:postId/insights",
  validateAndRefreshToken,
  async (req, res) => {
    const { postId } = req.params;

    try {
      const insightsResponse = await axios.get(
        `https://graph.facebook.com/v17.0/${postId}/insights`,
        {
          params: {
            metric: "impressions,reach,engagement",
            access_token: req.session.accessToken,
          },
        }
      );

      res.status(200).json({
        message: "Post insights retrieved successfully!",
        insights: insightsResponse.data.data,
      });
    } catch (error) {
      console.error("Error retrieving post insights:", error.message);
      res.status(500).json({ error: "Failed to retrieve post insights." });
    }
  }
);

module.exports = router;
