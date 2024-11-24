const express = require("express");
const axios = require("axios");
const router = express.Router();
const qs = require("qs");
require("dotenv").config();

// ----------------- Instagram Authentication ------------------
// Step 1: Redirect to Instagram for authorization
router.get("/auth/instagram", (req, res) => {
  console.log("firing inst auth");
  const testurl =
    "https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1103023324688943&redirect_uri=https://2410-105-119-4-170.ngrok-free.app/api/instagram/auth/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish";
  res.redirect(testurl);
});
// ----------------- Content Management Routes ------------------

// Step 2: Handle Instagram OAuth callback
router.get("/auth/instagram/callback", async (req, res) => {
  console.log("ig call back");
  const { code } = req.query;
  console.log("Received code:", code);

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

    console.log("Request payload:", payload);

   const tokenResponse = await axios.post(
     "https://api.instagram.com/oauth/access_token",
     qs.stringify({
       client_id: process.env.INSTAGRAM_CLIENT_ID,
       client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
       grant_type: "authorization_code",
       redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
       code,
     }),
     {
       headers: { "Content-Type": "application/x-www-form-urlencoded" },
     }
   );

    const { access_token, user_id } = tokenResponse.data;

    console.log("Access token response:", tokenResponse.data);

    res.status(201).json({ message: "access Granted" });
    // Proceed with fetching long-lived token and user profile...
  } catch (error) {
    console.error(
      "Error exchanging code for token:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ errorMessage: error.response?.data || error.message });
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
