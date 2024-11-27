const express = require("express");
const qs = require("qs");
const axios = require("axios");
const router = express.Router();

// Function to generate a random string (security purpose)
const generateRandomString = (length = 32) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};

// ----------------- Facebook Authentication ------------------
// Step 1: Redirect to Facebook for authorization
router.get("/auth/facebook", (req, res) => {
  const facebookAppId = process.env.FACEBOOK_APP_ID;
  const facebookRedirectUri = process.env.FACEBOOK_REDIRECT_URI;

  if (!facebookAppId || !facebookRedirectUri) {
    return res.status(500).send("Facebook App ID or Redirect URI not set.");
  }

  const randomString = generateRandomString();

  // Store the state in the session
  req.session.state = randomString;

  const facebookAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${facebookRedirectUri}&state=${randomString}&scope=email,public_profile,pages_manage_posts,pages_read_engagement,pages_manage_metadata`;

  res.redirect(facebookAuthUrl);
});

// Step 2: Handle Facebook OAuth callback
// router.get("/auth/facebook/callback", async (req, res) => {
//   const { code } = req.query;

//   if (!code) {
//     return res.status(400).json({ error: "Authorization code missing." });
//   }

//   try {
//     // Format the payload as urlencoded
//     const payload = qs.stringify({
//       client_id: process.env.FACEBOOK_APP_ID,
//       client_secret: process.env.FACEBOOK_APP_SECRET,
//       redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
//       code,
//     });

//     // Send the request to exchange the authorization code for an access token
//     const tokenResponse = await axios.post(
//       "https://graph.facebook.com/v17.0/oauth/access_token",
//       payload,
//       {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       }
//     );

//     const { access_token, expires_in } = tokenResponse.data;

//     // Store the access token and expiration
//     req.session.accessToken = access_token;
//     req.session.tokenExpiry = Date.now() + expires_in * 1000;

//     console.log({
//       message: "Facebook account connected successfully!",
//     });

//     res.json({ message: "Facebook account connected successfully!" });
//   } catch (error) {
//     console.error(
//       "Error exchanging code for token:",
//       error.response?.data || error.message
//     );
//     res.status(500).json({ error: "OAuth Authentication failed" });
//   }
// });

router.get("/auth/facebook/callback", async (req, res) => {
  const { code, state } = req.query;

  if (state !== req.session.state) {
    return res.status(403).send("Invalid state parameter.");
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`
    );
    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(500).send("Failed to obtain access token.");
    }

    // Fetch user pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/me/accounts?access_token=${tokenData.access_token}`
    );
    const pagesData = await pagesResponse.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      return res.status(404).send("No pages found.");
    }

    // Render a page selection interface
    res.render("selectPage", { pages: pagesData.data });
  } catch (error) {
    console.error("Error during Facebook OAuth callback:", error);
    res.status(500).send("An error occurred during authentication.");
  }
});

// Handle page selection
router.post("/select-page", (req, res) => {
  const selectedPageId = req.body.pageId;

  if (!selectedPageId) {
    return res.status(400).send("No page selected.");
  }

  // Store the selected page ID in the session or database
  req.session.selectedPageId = selectedPageId;

  res.send("Page selected successfully.");
});

// Middleware: Validate and refresh access token
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
    } catch (error) {
      console.error("Error refreshing access token:", error.message);
      return res.status(500).json({ error: "Failed to refresh access token." });
    }
  }

  next();
};

// ------------------ Posting to Facebook -------------------
router.post("/post/", validateAndRefreshToken, async (req, res) => {
  const { message, images } = req.body;

  if (!message && (!images || images.length === 0)) {
    return res
      .status(400)
      .json({ error: "Message or at least one image URL is required." });
  }

  try {
    const postResponse = await axios.post(
      `https://graph.facebook.com/v17.0/me/feed`,
      {
        access_token: req.session.accessToken,
        message,
      }
    );

    const postId = postResponse.data.id;

    if (images && images.length > 0) {
      const imageUploadPromises = images.map((imageUrl) =>
        axios.post(`https://graph.facebook.com/v17.0/${postId}/photos`, {
          access_token: req.session.accessToken,
          url: imageUrl,
          published: false,
        })
      );

      await Promise.all(imageUploadPromises);
    }

    res.json({
      message: "Content with multiple images posted successfully!",
      postId,
    });
  } catch (error) {
    console.error("Error posting to Facebook:", error.message);
    res.status(500).json({ error: "Failed to post content on Facebook." });
  }
});

router.get("/posts", validateAndRefreshToken, async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/me/posts?access_token=${req.session.accessToken}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.get("/posts/:id/insights", validateAndRefreshToken, async (req, res) => {
  const postId = req.params.id;
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/${postId}/insights?access_token=${req.session.accessToken}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching post insights:", error.message);
    res.status(500).json({ error: "Failed to fetch post insights" });
  }
});

module.exports = router;
