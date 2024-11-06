const express = require("express");
const axios = require("axios");
const router = express.Router();

// ----------------- Facebook Authentication ------------------
// Step 1: Redirect to Facebook for authorization
router.get("/auth/facebook", (req, res) => {
  const facebookAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&state={random-string}&scope=pages_manage_posts,pages_read_engagement,pages_show_list`;
  res.redirect(facebookAuthUrl);
});

// Step 2: Handle Facebook OAuth callback
router.get("/auth/facebook/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  try {
    // Exchange code for an access token
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/v17.0/oauth/access_token`,
      {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
          code,
        },
      }
    );

    const { access_token, expires_in } = tokenResponse.data;

    // Store the access token and set expiry time in session
    req.session.accessToken = access_token;
    req.session.tokenExpiry = Date.now() + expires_in * 1000;

    console.log("Facebook account connected successfully!");
    res.json({ message: "Facebook account connected successfully!" });
  } catch (error) {
    console.error("Error exchanging code for token:", error.message);
    res.status(500).send("OAuth Authentication failed");
  }
});

// Middleware to validate and refresh access token
const validateAndRefreshToken = async (req, res, next) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: "No access token found." });
  }

  const isTokenExpired = (expiry) => Date.now() > expiry;

  if (isTokenExpired(req.session.tokenExpiry)) {
    try {
      const refreshResponse = await axios.get(
        `https://graph.facebook.com/v17.0/oauth/access_token`,
        {
          params: {
            grant_type: "fb_exchange_token",
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            fb_exchange_token: req.session.accessToken,
          },
        }
      );

      req.session.accessToken = refreshResponse.data.access_token;
      req.session.tokenExpiry =
        Date.now() + refreshResponse.data.expires_in * 1000;

      console.log("Access token refreshed successfully.");
    } catch (error) {
      console.error("Error refreshing access token:", error.message);
      return res.status(500).json({ error: "Failed to refresh access token." });
    }
  }

  next();
};

//<------------- next section ----------->

// Route to create a Facebook post
router.post("/facebook/posts", validateAndRefreshToken, async (req, res) => {
  try {
    const { message, link } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/me/feed`,
      {
        message: message,
        link: link, // Optional: include if you want to post a link
        access_token: req.session.accessToken,
      }
    );

    res.status(201).json({
      message: "Facebook post created successfully",
      postId: response.data.id,
    });
  } catch (error) {
    console.error("Error creating Facebook post:", error);
    res.status(500).json({ error: "Failed to create Facebook post" });
  }
});

module.exports = router;
