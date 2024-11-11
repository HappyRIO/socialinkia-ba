const express = require("express");
const querystring = require("querystring");
const bcrypt = require("bcryptjs");
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
  console.log(CLIENT_SECRET);
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

// Google OAuth callback route
router.get("/auth/google/callback", async (req, res) => {
  console.log("callback activated");

  const tokenEndpoint = "https://oauth2.googleapis.com/token";
  const { code } = req.query;

  connectDB(); // Ensure database connection is established

  // Ensure the authorization code is present
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

  console.log("Token request body:", requestBody);

  const options = {
    method: "POST",
    url: tokenEndpoint,
    data: requestBody,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };

  try {
    // Exchange authorization code for tokens
    const response = await axios(options);
    console.log("Token exchange response:", response.data);

    const { access_token, id_token, expires_in } = response.data;

    // Get user profile from Google's userinfo endpoint
    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { name, picture, email } = profileResponse.data;

    // Check if user already exists in the database
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new record and hash a password
      const hashedPassword = await bcrypt.hash("password", 10); // Set a default password or generate one

      user = new User({
        name,
        email,
        picture,
        password: hashedPassword, // Store the hashed password
      });
      await user.save();
      console.log("New user created.");
    } else {
      console.log("User already exists.");
    }

    // Generate session token (JWT)
    const sessionToken = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "2h" } // Token expires in 2 hours
    );

    console.log("still runing auth");

    const sessionExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // Session expires in 2 hours

    // Store session token and expiration in the database
    user.sessionToken = sessionToken;
    user.sessionExpiresAt = sessionExpiresAt;
    await user.save();

    console.log(
      "added to users session tokken",
      sessionToken,
      sessionExpiresAt
    );

    // Set session token as an HTTP-only cookie
    res.cookie("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "none", // Allows cross-site cookie sharing
      // secure: false, // Test by setting this to false temporarily to verify if it's an HTTPS issue
      maxAge: 2 * 60 * 60 * 1000, // Cookie expiration (2 hours)
    });
    console.log("redirecting and shorting down............");
    // Respond with a script to handle redirection and closing in the popup
    res.status(201).send(`
  <script>
      // Otherwise, check for an opener and handle as before
      if (window.opener) {
        // Redirect the opener (original tab) to /dashboard
        window.opener.location.href = '${process.env.CLIENT_BASE_URL}/dashboard';
        // Close this popup window
        window.close();
      } else {
        // If no opener, just close this window without redirect
        window.close();
      }
  </script>
`);
  } catch (error) {
    console.error(
      "Error during Google OAuth callback:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to authenticate with Google." });
  }
});

module.exports = router;
