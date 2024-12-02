const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../../model/User.js");
const crypto = require("crypto");
const qs = require("qs");
const isSessionValid = require("../../middleware/isSessionValid.js");
require("dotenv").config();

// Step 1: Redirect to Instagram for authorization
router.get("/auth/instagram", isSessionValid, async (req, res) => {
  console.log("Firing Instagram auth");

  const instagramRedirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  const instagramClientId = process.env.FACEBOOK_APP_ID; // Shared with Facebook OAuth flow

  if (!instagramClientId || !instagramRedirectUri) {
    return res.status(500).send("Instagram Client ID or Redirect URI not set.");
  }

  const user = req.user;

  // Step 2: Get the Instagram Business Account ID from Facebook Graph API
  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${user.selectedFacebookBusinessPage.id}?fields=instagram_business_account&access_token=${user.selectedFacebookBusinessPage.accessToken}`
    );

    if (!response.ok) {
      return res.status(500).send("Error fetching Instagram business account");
    }

    const data = await response.json();

    // Ensure Instagram business account exists
    if (
      !data.instagram_business_account ||
      !data.instagram_business_account.id
    ) {
      return res.status(500).send("Instagram business account not found.");
    }

    const instagramBusinessAccountId = data.instagram_business_account.id;

    // Step 3: Obtain the Instagram Access Token (if needed)
    // If you need an Instagram Access Token, you may either request it through Instagram's OAuth flow or use a long-lived token
    // For now, I'm assuming you might need to store the access token you retrieve from Facebook
    const instagramAccessToken = user.selectedFacebookBusinessPage.accessToken; // using the same access token for now

    // Step 4: Update user with Instagram business page data
    await User.findByIdAndUpdate(user._id, {
      selectedInstagramBusinessPage: {
        id: instagramBusinessAccountId,
        name: user.selectedFacebookBusinessPage.name,
        accessToken: instagramAccessToken, // Assuming we are using the FB page's access token
      },
    });

    res.send("Instagram business account data saved successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing Instagram authorization.");
  }
});

// // Step 1: Redirect to Instagram for authorization
// router.get("/auth/instagram", isSessionValid, async (req, res) => {
//   console.log("Firing Instagram auth");

//   const instagramRedirectUri = process.env.INSTAGRAM_REDIRECT_URI;
//   const instagramClientId = process.env.FACEBOOK_APP_ID; // Shared with Facebook OAuth flow

//   if (!instagramClientId || !instagramRedirectUri) {
//     return res.status(500).send("Instagram Client ID or Redirect URI not set.");
//   }

//   const user = req.user;

//   const igbusiness = fetch(
//     `https://graph.facebook.com/v17.0/${user.selectedFacebookBusinessPage.id}?fields=instagram_business_account&access_token=${user.selectedFacebookBusinessPage.accessToken}`
//   );

//   const saveUser = User.findByIdAndUpdate{
//     user._id,{

//     }
//   }

//   // const scope = [
//   //   "instagram_basic",
//   //   "instagram_content_publish",
//   //   "instagram_manage_insights",
//   //   "pages_show_list",
//   //   "business_management",
//   // ].join(",");

//   // const instagramAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${instagramClientId}&redirect_uri=${instagramRedirectUri}&state=${req.user._id}&response_type=code&scope=${scope}`;

//   // res.redirect(instagramAuthUrl);
// });

// Step 2: Handle Instagram OAuth callback
router.get("/auth/instagram/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!state) {
    return res.status(400).json({ error: "Authorization state missing." });
  }

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  try {
    const tokenPayload = {
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      grant_type: "authorization_code",
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
      code,
    };

    console.log("Payload for token exchange:", tokenPayload);

    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      "https://graph.facebook.com/v17.0/oauth/access_token",
      null,
      { params: tokenPayload }
    );

    const { access_token } = tokenResponse.data;
    console.log("Access token received:", access_token);

    // Fetch user account information
    const accountsResponse = await axios.get(
      `https://graph.facebook.com/v17.0/me/accounts?access_token=${access_token}`
    );

    const accounts = accountsResponse.data.data;

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({ message: "No business accounts found." });
    }

    // Prepare HTML for account selection
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Select Instagram Business Account</title>
    </head>
    <body class="w-full p-4 flex flex-col items-center">
        <h1 class="text-2xl font-bold mb-4">Select an Instagram Business Account</h1>
        <ul class="w-full max-w-md flex flex-col gap-4">
            ${accounts
              .map(
                (account) => `
                <li class="border rounded-lg p-4 shadow">
                    <a href="/api/instagram/select-instagram-account?accountId=${account.id}&accountName=${account.name}&accessToken=${access_token}&user=${state}" 
                      class="text-blue-600 hover:underline font-bold">${account.name}</a>
                </li>`
              )
              .join("")}
        </ul>
    </body>
    </html>
    `;

    res.send(html);
  } catch (error) {
    console.error("Error during Instagram OAuth callback:", error.message);

    if (
      error.response?.data?.error?.message ===
      "This authorization code has been used."
    ) {
      console.error("Authorization code already used. Restarting OAuth.");
      return res.redirect("/auth/instagram");
    }

    res.status(500).send("An error occurred during authentication.");
  }
});

// Step 3: Handle account selection
router.get("/select-instagram-account", async (req, res) => {
  const { accountId, accountName, accessToken, user } = req.query;

  if (!accountId || !accountName) {
    return res.status(400).send("Account ID and Name are required.");
  }

  try {
    // Save selected account (example: linking to the logged-in user)
    const Users = await User.findByIdAndUpdate(
      user,
      {
        selectedInstagramBusinessPage: {
          id: accountId,
          name: accountName,
          accessToken,
        },
      },
      { new: true }
    );

    if (!Users) {
      return res.status(404).send("User not found.");
    }

    // Confirmation page
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Connected</title>
    </head>
    <body class="flex justify-center items-center h-screen bg-green-100">
        <div class="text-center">
            <h1 class="text-2xl font-bold text-green-600">Connected Successfully</h1>
            <p>Account Name: ${accountName}</p>
        </div>
    </body>
    </html>
    `;
    res.status(201).send(html);
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
