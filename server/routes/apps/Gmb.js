const express = require("express");
const { google } = require("googleapis");
const connectDB = require("../../data/db");
const axios = require("axios");
const querystring = require("querystring");
const User = require("../../model/User");
const router = express.Router();

// Ensure the database is connected when the server starts
connectDB();

// OAuth2 client setup
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.SERVER_BASE_URL}/api/gmb/auth/google/gmb/callback`;

// Middleware: Check if session token is valid
const isSessionValid = (req, res, next) => {
  connectDB();
  console.log("Validating session");
  console.log("Cookies:", req.cookies); // Check all cookies received
  const { sessionToken } = req.cookies;

  if (!sessionToken) {
    console.log("No session token provided");
    return res.status(401).json({ error: "No session token provided." });
  }

  User.findOne({ sessionToken })
    .then((user) => {
      if (!user) {
        console.log("Invalid session token.");
        return res.status(401).json({ error: "Invalid session token." });
      }

      const expirationTime = new Date(user.sessionExpiresAt);
      const currentTime = new Date();
      if (expirationTime <= currentTime) {
        console.log("Session expired.");
        return res.status(401).json({ error: "Session expired." });
      }

      req.user = user;
      next();
    })
    .catch((error) => {
      console.error("Error checking session validity:", error);
      res.status(500).json({ error: "Server error" });
    });
};

const googleScopes = [
  "openid",
  "profile",
  "email",
  "https://www.googleapis.com/auth/business.manage",
];

// auth route for authetification
router.get("/auth/gmb", (req, res) => {
  const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth?";
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: googleScopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    state: JSON.stringify({ flow: "gmbaccess" }),
  });

  res.redirect(`${authEndpoint}${queryParams}`);
});

// Route to handle OAuth response and obtain refresh token
router.get("/auth/google/gmb/callback", async (req, res) => {
  console.log({ message: "Processing callback for refresh token..." });
  const { code } = req.query;

  const tokenEndpoint = "https://oauth2.googleapis.com/token";

  const requestBody = querystring.stringify({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });

  try {
    const response = await axios.post(tokenEndpoint, requestBody, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("Token exchange response:", response.data);
    const { refresh_token } = response.data;

    if (!refresh_token) {
      console.error("Refresh token not received.");
      return res.status(500).json({ error: "Failed to obtain refresh token." });
    }

    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${response.data.access_token}` },
      }
    );

    const { email } = profileResponse.data;

    // Save user and tokens to database
    const user = await User.findOneAndUpdate(
      { email: email },
      { gmbrefreshToken: refresh_token },
      { new: true, upsert: true }
    );

    if (!user) {
      console.error("Failed to save user information.");
      return res
        .status(500)
        .json({ error: "Failed to save user information." });
    }

    console.log("Refresh token successfully obtained and saved.");
    res
      .status(200)
      .json({ message: "Refresh token obtained successfully", user });
  } catch (error) {
    console.error("Error during OAuth callback:", error.response.data);

    if (error.response) {
      console.error("Google API error:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error("Network error:", error.request);
      res.status(503).json({ error: "Network error, please try again later." });
    } else {
      console.error("Internal error:", error.message);
      res.status(500).json({ error: "Internal server error." });
    }
  }
});

// Step 3: Create a post
router.post("/posts", isSessionValid, async (req, res) => {
  try {
    const { user } = req;
    const { gmbrefreshToken } = user;

    oAuth2Client.setCredentials({ refresh_token: gmbrefreshToken });
    const myBusiness = google.mybusiness({ version: "v4", auth: oAuth2Client });

    const { locationId, postContent } = req.body;
    if (!locationId || !postContent) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await myBusiness.accounts.locations.localPosts.create({
      parent: `accounts/${locationId}`,
      requestBody: {
        summary: postContent,
        languageCode: "en-US",
      },
    });

    res.status(200).json({ message: "Post created", post: response.data });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Step 4: Get posts with analysis
router.get("/posts/:locationId", isSessionValid, async (req, res) => {
  try {
    const { user } = req;
    const { gmbrefreshToken } = user;

    oAuth2Client.setCredentials({ refresh_token: gmbrefreshToken });
    const myBusiness = google.mybusiness({ version: "v4", auth: oAuth2Client });
    const { locationId } = req.params;

    const response = await myBusiness.accounts.locations.localPosts.list({
      parent: `accounts/${locationId}`,
    });

    const posts = response.data.localPosts || [];
    const analysis = posts.map((post) => ({
      id: post.name,
      content: post.summary,
      verified: post.state === "VERIFIED",
      metrics: post.metric,
    }));

    res.status(200).json({ posts: analysis });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Step 5: Delete a post
router.delete("/posts/:postId", isSessionValid, async (req, res) => {
  try {
    const { user } = req;
    const { gmbrefreshToken } = user;

    oAuth2Client.setCredentials({ refresh_token: gmbrefreshToken });
    const myBusiness = google.mybusiness({ version: "v4", auth: oAuth2Client });
    const { postId } = req.params;

    await myBusiness.accounts.locations.localPosts.delete({ name: postId });
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;
