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
router.post("/facebook/posts", ensureAuthenticated, async (req, res) => {
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

// Route to get all Facebook posts
router.get("/facebook/posts", ensureAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/me/posts?fields=id,message,created_time,story&access_token=${req.session.accessToken}`
    );

    res.status(200).json(response.data.data);
  } catch (error) {
    console.error("Error fetching Facebook posts:", error);
    res.status(500).json({ error: "Failed to fetch Facebook posts" });
  }
});

// Route to get a specific Facebook post by ID
router.get("/facebook/posts/:id", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/${id}?fields=id,message,created_time,story,shares,likes.summary(true),comments.summary(true)&access_token=${req.session.accessToken}`
    );

    if (!response.data) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching Facebook post by ID:", error);
    res.status(500).json({ error: "Failed to fetch Facebook post" });
  }
});

// Route to get the number of likes for all posts within a week
router.get("/facebook/likes/week", ensureAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/me/posts?fields=id,created_time&access_token=${req.session.accessToken}`
    );

    const postsThisWeek = response.data.data.filter((post) => {
      const postDate = new Date(post.created_time);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return postDate >= weekAgo;
    });

    // Calculate total likes for posts within the past week
    const likeCounts = await Promise.all(
      postsThisWeek.map(async (post) => {
        const likesResponse = await axios.get(
          `https://graph.facebook.com/v17.0/${post.id}/likes?summary=true&access_token=${req.session.accessToken}`
        );
        return likesResponse.data.summary.total_count || 0;
      })
    );

    const totalLikes = likeCounts.reduce((sum, count) => sum + count, 0);

    res.json({ totalLikes });
  } catch (error) {
    console.error("Error fetching Facebook likes:", error);
    res.status(500).json({ error: "Failed to fetch Facebook likes." });
  }
});

// Route to track follower growth on Facebook (using insights)
router.get(
  "/facebook/follower-growth",
  ensureAuthenticated,
  async (req, res) => {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v17.0/me/insights?metric=page_fans&access_token=${req.session.accessToken}`
      );

      res.json({ followerGrowth: response.data.data });
    } catch (error) {
      console.error("Error fetching follower growth:", error);
      res.status(500).json({ error: "Failed to fetch follower growth." });
    }
  }
);

// Route to show performance of posts with a specific hashtag
router.get(
  "/facebook/hashtag/:hashtag/performance",
  ensureAuthenticated,
  async (req, res) => {
    const { hashtag } = req.params;

    try {
      const postsResponse = await axios.get(
        `https://graph.facebook.com/v17.0/me/posts?fields=id,message,created_time&access_token=${req.session.accessToken}`
      );

      const posts = postsResponse.data.data.filter(
        (post) => post.message && post.message.includes(`#${hashtag}`)
      );

      // Calculate engagement metrics for each post
      const performanceMetrics = await Promise.all(
        posts.map(async (post) => {
          const metricsResponse = await axios.get(
            `https://graph.facebook.com/v17.0/${post.id}?fields=shares,likes.summary(true),comments.summary(true)&access_token=${req.session.accessToken}`
          );
          return {
            ...post,
            shares: metricsResponse.data.shares
              ? metricsResponse.data.shares.count
              : 0,
            like_count: metricsResponse.data.likes.summary.total_count,
            comments_count: metricsResponse.data.comments.summary.total_count,
          };
        })
      );

      res.json({ performanceMetrics });
    } catch (error) {
      console.error("Error fetching Facebook posts by hashtag:", error);
      res.status(500).json({ error: "Failed to fetch posts by hashtag." });
    }
  }
);

module.exports = router;
