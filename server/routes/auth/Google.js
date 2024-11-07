const express = require("express");
const querystring = require("querystring");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const connectDB = require("../../data/db");
const router = express.Router();
const User = require("../../model/User");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_CLIENT_REDIRECT_URL;
const JWT_SECRET = process.env.JWT_SECRET; // JWT secret key

// Define Google OAuth 2.0 Scopes
const googleScopes = ["openid", "profile", "email"];

// Step 1: Redirect user to Google OAuth endpoint
router.get("/auth/google", (req, res) => {
  console.log("accessing goole auth system");
  const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth?";
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: googleScopes.join(" "),
    access_type: "offline",
    prompt: "consent",
  });

  const authUrl = `${authEndpoint}${queryParams}`;
  res.redirect(authUrl);
});

// Google OAuth callback
router.get("/auth/google/callback", async (req, res) => {
  console.log("callback activated");
  const tokenEndpoint = "https://oauth2.googleapis.com/token";
  const { code } = req.query;
  connectDB();
  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  const requestBody = querystring.stringify({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const options = {
    method: "POST",
    url: tokenEndpoint,
    data: requestBody,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };

  try {
    // Exchange authorization code for tokens
    const response = await axios(options);
    const { access_token, id_token, expires_in } = response.data;

    // Get user profile from Google's userinfo endpoint
    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { name, picture, email } = profileResponse.data;

    // Check if user exists in the database
    let user = await User.findOne({ email });
    if (!user) {
      // If user doesn't exist, create a new record
      user = new User({ name, email, picture });
      await user.save();
    }

    // Generate session token (JWT) and set expiration
    const sessionToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "2h",
    });
    const sessionExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // Store session token and expiration in the database
    user.sessionToken = sessionToken;
    user.sessionExpiresAt = sessionExpiresAt;
    await user.save();

    // Set the session token as a secure, HTTP-only cookie
    res.cookie("sessionToken", sessionToken, {
      httpOnly: true,
      secure: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    // Redirect to the frontend or send user data
    res.json({
      message: "Google login successful",
      user: { name, email, picture },
    });
  } catch (error) {
    console.error(
      "Error during Google OAuth callback:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to authenticate with Google." });
  }
});

module.exports = router;
