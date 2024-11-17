const express = require("express");
const { google } = require("googleapis");
const connectDB = require("../../data/db");
const User = require("../../model/User");
const router = express.Router();

// OAuth2 client setup
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:4000/api/gmb/auth/google/gmb/callback";
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

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

// Routes

// Step 1: Login route to start OAuth process
router.get("/auth/gmb", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/business.manage",
      "https://www.googleapis.com/auth/business.profile.performance",
    ],
  });

  console.log(oAuth2Client.credentials.scope);

  res.redirect(authUrl);
});

// Step 2: Callback route to handle OAuth response
router.get("/auth/google/gmb/callback", async (req, res) => {
  const { code } = req.query;
  if (!code)
    return res.status(400).json({ error: "Authorization code missing" });

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const plus = google.plus({ version: "v1", auth: oAuth2Client });
    const userInfo = await plus.people.get({ userId: "me" });

    const userEmail = userInfo.data.emails[0].value;

    // Save user and tokens to database
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { gmbrefreshToken: tokens.refresh_token },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during OAuth callback:", error);
    res.status(500).json({ error: "Failed to log in" });
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
