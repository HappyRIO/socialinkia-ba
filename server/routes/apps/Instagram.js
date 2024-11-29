const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../../model/User.js");
const crypto = require("crypto");
const qs = require("qs");
const isSessionValid = require("../../middleware/isSessionValid.js");
require("dotenv").config();

// Step 1: Redirect to Instagram for authorization
router.get("/auth/instagram", isSessionValid, (req, res) => {
  console.log("Firing Instagram auth");

  // Generate a unique state parameter
  const state = crypto.randomBytes(16).toString("hex");
  const authUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_basic,instagram_manage_comments,instagram_manage_insights,instagram_manage_messages,instagram_content_publish,pages_read_engagement,pages_manage_posts,business_management&state=${state}`;

  res.redirect(authUrl);
});

// Step 2: Handle Instagram OAuth callback
router.get("/auth/instagram/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  try {
    // Exchange the code for an access token
    const payload = {
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
      code,
    };

    console.log({ paylod: payload });

    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      qs.stringify(payload),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, user_id } = tokenResponse.data;

    console.log({ tokken: tokenResponse.data });

    console.log("Access token received:", access_token);

    // Check if the user exists by Instagram ID
    let user = await User.findOne({ instagramId: user_id });

    if (user) {
      console.log("Existing Instagram user detected. Updating access token...");
      user.instagramAccessToken = access_token;
      user.instagramTokenExpiry = new Date(
        Date.now() + 60 * 24 * 60 * 60 * 1000
      ); // 60 days
    } else {
      console.log("New Instagram user detected. Creating user record...");

      // Fetch Instagram user info for email (if required)
      const userInfoResponse = await axios.get(
        `https://graph.instagram.com/me?fields=id,username,email&access_token=${access_token}`
      );
      const userInfo = userInfoResponse.data;

      console.log({ userinfo: userInfo });

      user = new User({
        instagramId: user_id,
        instagramAccessToken: access_token,
        instagramTokenExpiry: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        email: userInfo.email || null, // Use the email from Instagram if available
      });
    }

    await user.save();

    // Fetch Instagram business accounts linked to the user
    const accountsResponse = await axios.get(
      `https://graph.facebook.com/v17.0/${user_id}/accounts?access_token=${access_token}`
    );
    const accounts = accountsResponse.data.data;

    if (!accounts || accounts.length === 0) {
      return res
        .status(404)
        .json({ message: "No Instagram business accounts found." });
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

// Step 3: Handle account selection
router.post("/select-instagram-account", async (req, res) => {
  const { userId, accountId, accountName, accountAccessToken } = req.body;

  if (!userId || !accountId) {
    return res.status(400).send("User ID and account ID are required.");
  }

  try {
    // Update the user with the selected Instagram business account
    const user = await User.findByIdAndUpdate(
      userId,
      {
        selectedInstagramBusinessPage: {
          id: accountId,
          name: accountName,
          accessToken: accountAccessToken,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.json({
      message: "Instagram business account selected successfully",
      user,
    });
  } catch (error) {
    console.error("Error selecting Instagram account:", error);
    res.status(500).send("An error occurred while selecting the account.");
  }
});

// Middleware to check token validity and refresh if necessary
const validateAndRefreshToken = async (req, res, next) => {
  const userId = req.userId; // Assuming userId is set in req after authentication middleware
  if (!userId) {
    return res.status(401).json({ error: "User ID is required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user || !user.instagramAccessToken) {
      return res.status(401).json({ error: "No access token found." });
    }

    const isTokenExpired = (expiry) => Date.now() > new Date(expiry).getTime();
    if (isTokenExpired(user.instagramTokenExpiry)) {
      const response = await axios.get(
        "https://graph.instagram.com/refresh_access_token",
        {
          params: {
            grant_type: "ig_refresh_token",
            access_token: user.instagramAccessToken,
          },
        }
      );

      user.instagramAccessToken = response.data.access_token;
      user.instagramTokenExpiry = new Date(
        Date.now() + response.data.expires_in * 1000
      );
      await user.save();

      console.log("Access token refreshed successfully.");
    }

    req.instagramAccessToken = user.instagramAccessToken; // Pass token for later use
    next();
  } catch (error) {
    console.error("Error validating or refreshing token:", error.message);
    res
      .status(500)
      .json({ error: "Failed to validate or refresh access token." });
  }
};

// ----------------- Content Management Routes ------------------

// Example route to confirm functionality
router.get("/all", validateAndRefreshToken, async (req, res) => {
  res.json({ message: "Token validated successfully." });
});

// Route to publish content on Instagram
router.post("/post", validateAndRefreshToken, async (req, res) => {
  const { caption, imageUrl } = req.body;
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
        access_token: req.instagramAccessToken,
      }
    );

    const { id: mediaContainerId } = mediaContainerResponse.data;

    // Step 2: Publish media
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.INSTAGRAM_USER_ID}/media_publish`,
      {
        creation_id: mediaContainerId,
        access_token: req.instagramAccessToken,
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

// Get posts
router.get("/user/media", validateAndRefreshToken, async (req, res) => {
  try {
    const mediaResponse = await axios.get(
      `https://graph.instagram.com/me/media`,
      {
        params: {
          fields:
            "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
          access_token: req.instagramAccessToken,
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

// Get post insights
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
            access_token: req.instagramAccessToken,
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
