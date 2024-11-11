const express = require("express");
const axios = require("axios");
const router = express.Router();

// ----------------- Facebook Authentication ------------------
// Step 1: Redirect to Facebook for authorization
router.get("/auth/facebook", (req, res) => {
  console.log("firing facebook auth");
  // Facebook App ID and Redirect URI (from your environment variables)
  const facebookAppId = process.env.FACEBOOK_APP_ID;
  const facebookRedirectUri = process.env.FACEBOOK_REDIRECT_URI;

  // Generate a random string for state (improve security)
  const randomString = generateRandomString(); // Replace with a function to generate a random string

  // Construct the Facebook login URL with scope for login only
  const facebookAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${facebookRedirectUri}&state=${randomString}&scope=email,public_profile`; // Scope includes email and public profile

  // Redirect user to the Facebook login page
  res.redirect(facebookAuthUrl);
});

// Function to generate a random string (example)
function generateRandomString(length = 32) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Step 2: Handle Facebook OAuth callback
router.get("/auth/facebook/callback", async (req, res) => {
  console.log("back to call back");
  const { code } = req.query;
  console.log(code);
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

// Add a route for posting to Facebook
router.post("/post/", validateAndRefreshToken, async (req, res) => {
  const { message, images } = req.body; // 'images' is expected to be an array of URLs

  if (!message && (!images || images.length === 0)) {
    return res.status(400).json({
      error: "Message or at least one image URL required for posting.",
    });
  }

  try {
    // Step 1: Create an initial post with the message
    const postResponse = await axios.post(
      `https://graph.facebook.com/v17.0/me/feed`,
      {
        access_token: req.session.accessToken,
        message,
      }
    );

    const postId = postResponse.data.id;

    // Step 2: Attach each image to the post
    if (images && images.length > 0) {
      const imageUploadPromises = images.map((imageUrl) => {
        return axios.post(`https://graph.facebook.com/v17.0/${postId}/photos`, {
          access_token: req.session.accessToken,
          url: imageUrl,
          published: false, // Set to false to link it as part of the same post
        });
      });

      // Wait for all image uploads to complete
      await Promise.all(imageUploadPromises);
    }

    console.log("Content with multiple images posted to Facebook");
    res.json({
      message: "Content with multiple images posted successfully on Facebook",
      postId,
    });
  } catch (error) {
    console.error("Error posting content to Facebook:", error.message);
    res.status(500).json({ error: "Failed to post content on Facebook" });
  }
});

module.exports = router;
