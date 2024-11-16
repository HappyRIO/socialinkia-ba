const express = require("express");
const axios = require("axios");
const router = express.Router();

// Import your User model
const User = require("../../model/User");
// ----------------- Utility Functions ------------------

// Function to generate a random string for state parameter (enhance security)
function generateRandomString(length = 32) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
}

// Function to get Instagram Business Account ID
const getInstagramBusinessAccountId = async (accessToken) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/me/accounts`,
      {
        params: {
          access_token: accessToken,
          fields: "id,name,instagram_business_account",
        },
      }
    );

    const pages = response.data.data;

    for (const page of pages) {
      if (page.instagram_business_account) {
        return page.instagram_business_account.id;
      }
    }

    return null;
  } catch (error) {
    console.error(
      "Error fetching Instagram Business Account ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ----------------- Facebook Authentication ------------------

// Step 1: Redirect to Facebook for authorization
router.get("/auth/facebook", (req, res) => {
  console.log("Redirecting to Facebook for authentication...");
  const facebookAppId = process.env.FACEBOOK_APP_ID;
  const facebookRedirectUri = process.env.FACEBOOK_REDIRECT_URI;

  const state = generateRandomString();

  // Include additional scopes for Instagram integration
  const facebookAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${encodeURIComponent(
    facebookRedirectUri
  )}&state=${state}&scope=email,public_profile,pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish,instagram_manage_insights`;

  // Optionally, store the state in session for CSRF protection
  req.session.oauthState = state;

  res.redirect(facebookAuthUrl);
});

// Step 2: Handle Facebook OAuth callback
router.get("/auth/facebook/callback", async (req, res) => {
  console.log("Handling Facebook OAuth callback...");
  const { code, state } = req.query;

  // Optional: Validate state parameter for CSRF protection
  if (state !== req.session.oauthState) {
    return res.status(400).json({ error: "Invalid state parameter." });
  }

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  try {
    // Exchange code for access token
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

    // Fetch Facebook Pages and Instagram Business Account
    const instagramAccountId = await getInstagramBusinessAccountId(
      access_token
    );

    if (instagramAccountId) {
      console.log("Instagram Business Account ID:", instagramAccountId);
      req.session.instagramAccountId = instagramAccountId;

      // Optionally, save InstagramAccountId to User model
      if (req.session.userId) {
        // Assuming you have userId in session
        await User.findByIdAndUpdate(
          req.session.userId,
          { instagramAccountId },
          { new: true }
        );
      }
    } else {
      console.warn(
        "No Instagram Business Account linked to any Facebook Page."
      );
    }

    res.json({
      message: "Facebook account connected successfully!",
      instagramAccountId,
    });
  } catch (error) {
    console.error(
      "Error during Facebook OAuth callback:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "OAuth Authentication failed." });
  }
});

// ----------------- Middleware to Validate and Refresh Access Token ------------------

const validateAndRefreshToken = async (req, res, next) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: "No access token found." });
  }

  const isTokenExpired = Date.now() > req.session.tokenExpiry;

  if (isTokenExpired) {
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
      console.error(
        "Error refreshing access token:",
        error.response?.data || error.message
      );
      return res.status(500).json({ error: "Failed to refresh access token." });
    }
  }

  next();
};

// ----------------- Facebook Routes ------------------

// Route to create a post on Facebook
router.post("/post/", validateAndRefreshToken, async (req, res) => {
  const { message, images } = req.body; // 'images' is expected to be an array of URLs

  if (!message && (!images || images.length === 0)) {
    return res.status(400).json({
      error: "Message or at least one image URL is required for posting.",
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
      const imageUploadPromises = images.map((imageUrl) =>
        axios.post(`https://graph.facebook.com/v17.0/${postId}/photos`, {
          access_token: req.session.accessToken,
          url: imageUrl,
          published: false, // Set to false to link it as part of the same post
        })
      );

      // Wait for all image uploads to complete
      await Promise.all(imageUploadPromises);
    }

    console.log("Content with multiple images posted to Facebook.");
    res.json({
      message: "Content with multiple images posted successfully on Facebook.",
      postId,
    });
  } catch (error) {
    console.error(
      "Error posting content to Facebook:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to post content on Facebook." });
  }
});

// Route to fetch Facebook posts
router.get("/posts", validateAndRefreshToken, async (req, res) => {
  try {
    const postsResponse = await axios.get(
      `https://graph.facebook.com/v17.0/me/posts`,
      {
        params: {
          access_token: req.session.accessToken,
          fields:
            "id,message,created_time,insights.metric(post_impressions,post_engaged_users)",
          limit: 100, // Adjust the limit as needed
        },
      }
    );

    const posts = postsResponse.data.data;

    res.json({ posts });
  } catch (error) {
    console.error(
      "Error fetching Facebook posts:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch Facebook posts." });
  }
});

// Route to fetch insights for a specific Facebook post
router.get(
  "/posts/:postId/insights",
  validateAndRefreshToken,
  async (req, res) => {
    const { postId } = req.params;

    try {
      const insightsResponse = await axios.get(
        `https://graph.facebook.com/v17.0/${postId}/insights`,
        {
          params: {
            access_token: req.session.accessToken,
            metric: "post_impressions,post_engaged_users",
          },
        }
      );

      const insights = insightsResponse.data.data;

      res.json({ insights });
    } catch (error) {
      console.error(
        "Error fetching post insights:",
        error.response?.data || error.message
      );
      res.status(500).json({ error: "Failed to fetch post insights." });
    }
  }
);

// ----------------- Instagram Routes ------------------

// Route to create a post on Instagram
router.post("/instagram/post", validateAndRefreshToken, async (req, res) => {
  const { caption, imageUrl } = req.body;

  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: "Image URL is required for Instagram post." });
  }

  try {
    // Get Instagram Business Account ID from session
    let instagramAccountId = req.session.instagramAccountId;

    if (!instagramAccountId) {
      instagramAccountId = await getInstagramBusinessAccountId(
        req.session.accessToken
      );
      req.session.instagramAccountId = instagramAccountId;

      // Optionally, save to User model if you have user ID in session
      if (req.session.userId) {
        // Replace with your actual user ID retrieval
        await User.findByIdAndUpdate(
          req.session.userId,
          { instagramAccountId },
          { new: true }
        );
      }
    }

    if (!instagramAccountId) {
      return res
        .status(400)
        .json({ error: "No Instagram Business Account found." });
    }

    // Step 1: Create a media object
    const createMediaResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${instagramAccountId}/media`,
      {
        image_url: imageUrl,
        caption: caption || "",
        access_token: req.session.accessToken,
      }
    );

    const creationId = createMediaResponse.data.id;

    // Step 2: Publish the media object
    const publishMediaResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${instagramAccountId}/media_publish`,
      {
        creation_id: creationId,
        access_token: req.session.accessToken,
      }
    );

    const postId = publishMediaResponse.data.id;

    console.log("Instagram post created:", postId);
    res.json({
      message: "Instagram post created successfully!",
      postId,
    });
  } catch (error) {
    console.error(
      "Error creating Instagram post:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to create Instagram post." });
  }
});

// Route to fetch Instagram posts
router.get("/instagram/posts", validateAndRefreshToken, async (req, res) => {
  try {
    // Get Instagram Business Account ID from session
    let instagramAccountId = req.session.instagramAccountId;

    if (!instagramAccountId) {
      instagramAccountId = await getInstagramBusinessAccountId(
        req.session.accessToken
      );
      req.session.instagramAccountId = instagramAccountId;

      // Optionally, save to User model if you have user ID in session
      if (req.session.userId) {
        // Replace with your actual user ID retrieval
        await User.findByIdAndUpdate(
          req.session.userId,
          { instagramAccountId },
          { new: true }
        );
      }
    }

    if (!instagramAccountId) {
      return res
        .status(400)
        .json({ error: "No Instagram Business Account found." });
    }

    // Fetch Instagram posts
    const postsResponse = await axios.get(
      `https://graph.facebook.com/v17.0/${instagramAccountId}/media`,
      {
        params: {
          access_token: req.session.accessToken,
          fields:
            "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp",
          limit: 100, // Adjust as needed
        },
      }
    );

    const posts = postsResponse.data.data;

    res.json({ posts });
  } catch (error) {
    console.error(
      "Error fetching Instagram posts:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch Instagram posts." });
  }
});

// Route to fetch insights for a specific Instagram post
router.get(
  "/instagram/posts/:postId/insights",
  validateAndRefreshToken,
  async (req, res) => {
    const { postId } = req.params;

    try {
      const insightsResponse = await axios.get(
        `https://graph.facebook.com/v17.0/${postId}/insights`,
        {
          params: {
            access_token: req.session.accessToken,
            metric: "engagement,impressions,reach",
          },
        }
      );

      const insights = insightsResponse.data.data;

      res.json({ insights });
    } catch (error) {
      console.error(
        "Error fetching Instagram post insights:",
        error.response?.data || error.message
      );
      res
        .status(500)
        .json({ error: "Failed to fetch Instagram post insights." });
    }
  }
);

// ----------------- Additional Routes for Subscription History ------------------

// Assuming you have a separate router for subscription routes
// If not, you can integrate them here or in another file

// Example route to get subscription history
// router.get("/subscription-history", isSessionValid, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate("subscription"); // Ensure 'subscription' is a ref if using populate
//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     // Assuming your SubscriptionSchema is embedded or referenced properly
//     const subscriptionHistory = user.subscription?.paymentHistory || [];

//     res.status(200).json({ subscriptionHistory });
//   } catch (error) {
//     console.error("Error retrieving subscription history:", error);
//     res.status(500).json({ error: "Failed to retrieve subscription history." });
//   }
// });

// ----------------- Helper Route to Fetch User Details ------------------

// You can enhance this route to include Instagram details as well
// router.get("/user/details", isSessionValid, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password"); // Exclude sensitive fields

//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     res.status(200).json({ user });
//   } catch (error) {
//     console.error("Error retrieving user details:", error);
//     res.status(500).json({ error: "Failed to retrieve user details." });
//   }
// });

module.exports = router;
