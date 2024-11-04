const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

// ----------------- Instagram Authentication ------------------
// Step 1: Redirect to Instagram for authorization
router.get("/auth/instagram", (req, res) => {
  const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.INSTAGRAM_REDIRECT_URI}&response_type=code&scope=instagram_basic,instagram_business_basic`;
  res.redirect(instagramAuthUrl);
});
// ----------------- Content Management Routes ------------------

// Step 2: Handle Instagram OAuth callback
router.get("/auth/instagram/callback", async (req, res) => {
  const { code } = req.query;

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

//<--------------------- route to get post --------------------------->
// Route to create an Instagram post
router.post("/instagram/posts", validateAndRefreshToken, async (req, res) => {
  try {
    const { caption, imageUrl } = req.body;

    if (!caption || !imageUrl) {
      return res
        .status(400)
        .json({ error: "Caption and image URL are required." });
    }

    // Replace {user-id} with the actual Instagram business account ID
    const userId = req.session.instagramUserId; // Ensure this is set during authentication

    // Step 1: Create the media object
    const mediaResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${userId}/media`,
      {
        image_url: imageUrl,
        caption: caption,
      },
      {
        params: {
          access_token: req.session.accessToken,
        },
      }
    );

    const creationId = mediaResponse.data.id;

    // Step 2: Publish the media object
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${userId}/media_publish`,
      {
        creation_id: creationId,
      },
      {
        params: {
          access_token: req.session.accessToken,
        },
      }
    );

    res.status(201).json({
      message: "Instagram post created successfully",
      postId: publishResponse.data.id,
    });
  } catch (error) {
    console.error(
      "Error creating Instagram post:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to create Instagram post" });
  }
});

// Route to get all Instagram posts
router.get("/posts/all", validateAndRefreshToken, async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp&access_token=${req.session.accessToken}`
    );

    res.status(200).json(response.data.data);
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    res.status(500).json({ error: "Failed to fetch Instagram posts" });
  }
});

// Route to get a specific Instagram post by ID
router.get("/posts/:id", validateAndRefreshToken, async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `https://graph.instagram.com/${id}?fields=id,caption,media_type,media_url,timestamp,like_count,comments_count&access_token=${req.session.accessToken}`
    );

    if (!response.data) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching Instagram post by ID:", error);
    res.status(500).json({ error: "Failed to fetch Instagram post" });
  }
});

//<------------------- analisys ------------------->

// Route to get likes for the past week on Instagram
router.get(
  "/instagram/likes/week",
  validateAndRefreshToken,
  async (req, res) => {
    try {
      // Logic to calculate total likes for the week
      const response = await axios.get(
        `https://graph.instagram.com/me/media?fields=id,likes`,
        {
          headers: {
            Authorization: `Bearer ${req.session.accessToken}`,
          },
        }
      );

      const likesThisWeek = response.data.data.filter((post) => {
        // Logic to filter likes based on the current week
      });

      res.json({ totalLikes: likesThisWeek.length });
    } catch (error) {
      console.error("Error fetching Instagram likes:", error);
      res.status(500).json({ error: "Failed to fetch likes." });
    }
  }
);

// Route to track follower growth on Instagram over the past month
router.get(
  "/instagram/follower-growth",
  validateAndRefreshToken,
  async (req, res) => {
    try {
      // Logic to fetch follower count over the past month
      const response = await axios.get(
        `https://graph.instagram.com/me?fields=followers_count`,
        {
          headers: {
            Authorization: `Bearer ${req.session.accessToken}`,
          },
        }
      );

      res.json({ followerGrowth: response.data.followers_count });
    } catch (error) {
      console.error("Error fetching follower growth:", error);
      res.status(500).json({ error: "Failed to fetch follower growth." });
    }
  }
);

//<--------------------- content descourvery ------------------->

// Route to show performance of posts with a specific hashtag on Instagram
router.get(
  "/instagram/hashtag/:hashtag/performance",
  validateAndRefreshToken,
  async (req, res) => {
    const { hashtag } = req.params;

    try {
      // Logic to fetch posts tagged with the specified hashtag
      const postsResponse = await axios.get(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp&access_token=${req.session.accessToken}`
      );

      const posts = postsResponse.data.data.filter(
        (post) => post.caption && post.caption.includes(`#${hashtag}`)
      );

      // Calculate engagement metrics for each post (likes, comments, etc.)
      const performanceMetrics = await Promise.all(
        posts.map(async (post) => {
          const metricsResponse = await axios.get(
            `https://graph.instagram.com/${post.id}?fields=like_count,comments_count&access_token=${req.session.accessToken}`
          );
          return {
            ...post,
            like_count: metricsResponse.data.like_count,
            comments_count: metricsResponse.data.comments_count,
          };
        })
      );

      res.json({ performanceMetrics });
    } catch (error) {
      console.error("Error fetching Instagram posts by hashtag:", error);
      res.status(500).json({ error: "Failed to fetch posts." });
    }
  }
);

module.exports = router;
