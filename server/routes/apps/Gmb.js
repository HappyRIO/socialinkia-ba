const express = require("express");
const querystring = require("querystring");
const axios = require("axios");
const connectDB = require("../../data/db");
const User = require("../../model/User");
const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SERVER_BASE_URL = process.env.SERVER_BASE_URL;

if (!CLIENT_ID || !CLIENT_SECRET || !SERVER_BASE_URL) {
  throw new Error("Missing required environment variables.");
}

// Initiate Google OAuth for GMB access
router.get("/auth/google/gmb", (req, res) => {
  const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
  const scopes = [
    "https://www.googleapis.com/auth/business.manage",
    "openid",
    "profile",
    "email",
  ];

  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: `${SERVER_BASE_URL}/api/google/auth/google/gmb/callback`,
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
  });

  console.log("Redirecting to Google OAuth with query:", queryParams);
  res.redirect(`${authEndpoint}?${queryParams}`);
});

router.get("/auth/google/gmb/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  try {
    await connectDB();

    const tokenEndpoint = "https://oauth2.googleapis.com/token";

    const requestBody = querystring.stringify({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: `${SERVER_BASE_URL}/api/google/auth/google/gmb/callback`,
      grant_type: "authorization_code",
    });

    const tokenResponse = await axios.post(tokenEndpoint, requestBody, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    const accountsEndpoint = "https://mybusiness.googleapis.com/v4/accounts";

    const accountsResponse = await axios.get(accountsEndpoint, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const accounts = accountsResponse.data.accounts;

    if (!accounts || accounts.length === 0) {
      return res
        .status(400)
        .json({ error: "No Google My Business accounts found." });
    }

    const accountId = accounts[0].name.split("/")[1];

    const locationsEndpoint = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations`;

    const locationsResponse = await axios.get(locationsEndpoint, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const locations = locationsResponse.data.locations;

    if (!locations || locations.length === 0) {
      return res.status(400).json({ error: "No locations found for account." });
    }

    const locationId = locations[0].name.split("/")[3];

    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { email } = profileResponse.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    user.gmbAccessToken = access_token;
    user.gmbRefreshToken = refresh_token;
    user.gmbTokenExpiresAt = new Date(Date.now() + expires_in * 1000);
    user.gmbAccountId = accountId;
    user.gmbLocationId = locationId;

    await user.save();

    res.redirect("/success");
  } catch (error) {
    console.error("Error handling callback:", error.message);
    res.status(500).json({ error: "Failed to process OAuth callback." });
  }
});

const refreshAccessToken = async (req, res, next) => {
  const { user } = req;

  if (!user || !user.gmbRefreshToken) {
    return res
      .status(400)
      .json({ error: "No refresh token available for user." });
  }

  const tokenEndpoint = "https://oauth2.googleapis.com/token";

  try {
    const requestBody = querystring.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: user.gmbRefreshToken,
      grant_type: "refresh_token",
    });

    const response = await axios.post(tokenEndpoint, requestBody, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, expires_in } = response.data;

    user.gmbAccessToken = access_token;
    user.gmbTokenExpiresAt = new Date(Date.now() + expires_in * 1000);
    await user.save();

    console.log("Access token refreshed for user:", user.email);
    next();
  } catch (error) {
    console.error("Failed to refresh access token:", error.message);
    return res.status(500).json({
      error: "Failed to refresh access token.",
      details: error.message,
    });
  }
};

router.get(
  "/gmb/posts",
  isSessionValid,
  refreshAccessToken,
  async (req, res) => {
    try {
      const { gmbAccountId, gmbLocationId } = req.user;

      if (!gmbAccountId || !gmbLocationId) {
        return res.status(400).json({
          error: "Google My Business account or location details missing.",
        });
      }

      const postsEndpoint = `https://mybusiness.googleapis.com/v4/accounts/${gmbAccountId}/locations/${gmbLocationId}/localPosts`;

      const response = await axios.get(postsEndpoint, {
        headers: { Authorization: `Bearer ${req.user.gmbAccessToken}` },
      });

      res.status(200).json({
        message: "Posts retrieved successfully.",
        posts: response.data,
      });
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      res.status(500).json({ error: "Failed to retrieve posts." });
    }
  }
);

router.get(
  "/gmb/posts/performance",
  isSessionValid,
  refreshAccessToken,
  async (req, res) => {
    try {
      const { gmbAccountId, gmbLocationId, gmbAccessToken } = req.user;

      if (!gmbAccountId || !gmbLocationId) {
        return res.status(400).json({
          error: "Google My Business account or location details missing.",
        });
      }

      const performanceEndpoint = `https://mybusiness.googleapis.com/v4/accounts/${gmbAccountId}/locations/${gmbLocationId}/localPosts/{postId}/insights`;

      const response = await axios.get(performanceEndpoint, {
        headers: { Authorization: `Bearer ${gmbAccessToken}` },
      });

      res.status(200).json({
        message: "Post performance report retrieved successfully.",
        insights: response.data,
      });
    } catch (error) {
      console.error("Error fetching post performance report:", error.message);
      res.status(500).json({
        error: "Failed to retrieve post performance report.",
        details: error.message,
      });
    }
  }
);

module.exports = router;
