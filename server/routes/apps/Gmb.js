const express = require("express");
const querystring = require("querystring");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const connectDB = require("../../data/db");
const User = require("../../model/User");
const isSessionValid = require("../../middleware/isSessionValid");
const { config } = require("dotenv");
const router = express.Router();
config()

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const REDIRECT_URI = `${process.env.SERVER_BASE_URL}/api/gmb/auth/google/gmb/callback`;

const googleScopes = [
  "openid",
  "profile",
  "email",
  "https://www.googleapis.com/auth/business.manage",
];

// Helper for exponential backoff
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeRequestWithRetry = async (url, options, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url, options);
    } catch (error) {
      if (error.response?.status === 429 && i < retries - 1) {
        const waitTime = Math.pow(2, i) * 1000; // Exponential backoff
        console.warn(`Rate limited. Retrying in ${waitTime / 1000}s...`);
        await delay(waitTime);
      } else {
        throw error; // Rethrow after exhausting retries or for other errors
      }
    }
  }
};

// Redirect to Google for GMB Authentication
router.get("/auth/gmb", (req, res) => {
  const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: googleScopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    state: JSON.stringify({ flow: "gmbaccess" }), // Optional: pass any required state
  });

  res.redirect(`${authEndpoint}?${queryParams}`);
});

// Handle GMB OAuth Callback

router.get("/auth/google/gmb/callback", async (req, res) => {
  console.log("--- GMB OAuth Callback Triggered ---");

  const { code } = req.query;
  console.log("Authorization Code Received:", code);

  if (!code) {
    console.error("Authorization code missing in callback.");
    return res.status(400).json({ error: "Authorization code not provided." });
  }

  try {
    // Step 1: Exchange authorization code for access and refresh tokens
    console.log("Exchanging authorization code for tokens...");
    const tokenPayload = querystring.stringify({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      tokenPayload,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    console.log("Token Response:", tokenResponse.data);

    const { access_token, refresh_token } = tokenResponse.data;

    if (!refresh_token) {
      console.error("No refresh token received from Google.");
      throw new Error("Failed to retrieve refresh token.");
    }

    // Step 2: Fetch user profile using access token
    console.log("Fetching user profile with access token...");
    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    console.log("User Profile Response:", profileResponse.data);

    const { email } = profileResponse.data;

    // Step 3: Save user and tokens in the database
    console.log("Saving user to database...");
    let user = await User.findOne({ email });

    if (!user) {
      console.log("New user detected, creating record...");
      user = new User({ email, gmbRefreshToken: refresh_token });
      await user.save();
    } else {
      console.log("Existing user detected, updating refresh token...");
      user.gmbRefreshToken = refresh_token;
      await user.save();
    }

    // Step 4: Fetch GMB accounts
    console.log("Fetching GMB accounts...");
    const accountsResponse = await axios.get(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    console.log("GMB Accounts Response:", accountsResponse.data);

    const accounts = accountsResponse.data.accounts || [];

    // Step 5: Fetch locations for each account
    console.log("Fetching locations for accounts...");
    const locations = [];

    for (const account of accounts) {
      try {
        console.log(`Fetching locations for account: ${account.name}`);

        const locationsResponse = await axios.get(
          `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${account.name}/locations`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
            params: { readMask: "storeCode,name,locationName" },
          }
        );

        console.log("Locations Response:", locationsResponse.data);
        locations.push(...(locationsResponse.data.locations || []));
      } catch (error) {
        console.error(
          `Error fetching locations for account ${account.name}:`,
          error.response?.data || error.message
        );
      }
    }

    // Step 6: Display locations or handle empty case
    console.log("Locations fetched successfully.", locations);
    if (locations.length > 0) {
      const locationHtml = locations
        .map(
          (location) => `
          <li>
            ${location.locationName || location.name}
            <a href="/api/gmb/save-location?locationId=${encodeURIComponent(
              location.name
            )}&locationName=${encodeURIComponent(
            location.locationName || location.name
          )}">
              Select
            </a>
          </li>
        `
        )
        .join("");

      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Select Business Location</title>
        </head>
        <body>
          <h1>Select a Business Location</h1>
          <ul>${locationHtml}</ul>
        </body>
        </html>
      `);
    } else {
      console.warn("No locations found for the user's GMB account.");
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>No Locations Found</title>
        </head>
        <body>
          <h1>No business locations found for your account.</h1>
        </body>
        </html>
      `);
    }
  } catch (error) {
    console.error(
      "Error during GMB OAuth callback:",
      error.response?.data || error.message
    );
    return res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
      </head>
      <body>
        <h1>Failed to authenticate with Google My Business.</h1>
        <p>${error.message}</p>
      </body>
      </html>
    `);
  }
});

// Save Location Route
router.get("/save-location", isSessionValid, async (req, res) => {
  const { locationId, locationName } = req.query;

  if (!locationId || !locationName) {
    return res.status(400).send(`
      <h1>Error</h1>
      <p>Location ID and name are required.</p>
    `);
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send(`
        <h1>Error</h1>
        <p>User not found.</p>
      `);
    }

    user.selectedGoogleBusinessPage = {
      id: locationId,
      name: locationName,
    };

    await user.save();

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Location Saved</title>
      </head>
      <body>
        <h1>Location Saved Successfully</h1>
        <p>Selected location: ${locationName}</p>
        <script>
        window.close()
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error saving selected location:", error.message);
    res.status(500).send(`
      <h1>Error</h1>
      <p>Internal server error.</p>
    `);
  }
});

// Create a Post for a Location
router.post(
  "/gmb/location/:locationId/post",
  isSessionValid,
  async (req, res) => {
    const { locationId } = req.params;
    const { summary, callToActionUrl, mediaUrls } = req.body;

    try {
      // Fetch the user's access token
      const user = await User.findById(req.user._id); // Assuming req.user._id is populated by authentication middleware
      if (!user || !user.gmbRefreshToken) {
        return res.status(401).json({ error: "No GMB account linked." });
      }

      const accessToken = user.gmbAccessToken; // Refresh the token if needed

      const postPayload = {
        summary,
        callToAction: {
          actionType: "LEARN_MORE",
          url: callToActionUrl,
        },
        media: mediaUrls.map((url) => ({
          mediaFormat: "PHOTO",
          sourceUrl: url,
        })),
      };

      const response = await axios.post(
        `https://mybusiness.googleapis.com/v4/${locationId}/localPosts`,
        postPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      concole.log({
        message: "Post created successfully.",
        data: response.data,
      });
      res
        .status(201)
        .json({ message: "Post created successfully.", data: response.data });
    } catch (error) {
      console.error(
        "Error creating GMB post:",
        error.response?.data || error.message
      );
      res
        .status(500)
        .json({ error: error.response?.data || "Internal server error." });
    }
  }
);

// Get all posts from all locations
router.get("/gmb/posts/all", isSessionValid, async (req, res) => {
  try {
    // Fetch the user's access token
    const user = await User.findById(req.user._id);
    if (!user || !user.gmbAccessToken) {
      return res.status(401).json({ error: "No GMB account linked." });
    }

    const accessToken = user.gmbAccessToken;

    // Fetch all accounts
    const accountsResponse = await axios.get(
      "https://mybusiness.googleapis.com/v4/accounts",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const accounts = accountsResponse.data.accounts || [];
    const allPosts = [];

    // Iterate over each account to fetch locations
    for (const account of accounts) {
      const locationsResponse = await axios.get(
        `https://mybusiness.googleapis.com/v4/${account.name}/locations`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const locations = locationsResponse.data.locations || [];

      // Fetch posts for each location
      for (const location of locations) {
        try {
          const postsResponse = await axios.get(
            `https://mybusiness.googleapis.com/v4/${location.name}/localPosts`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const posts = postsResponse.data.localPosts || [];

          // Fetch insights for each post
          const postsWithInsights = await Promise.all(
            posts.map(async (post) => {
              try {
                const insightsResponse = await axios.get(
                  `https://mybusiness.googleapis.com/v4/${post.name}/insights`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );
                return { ...post, insights: insightsResponse.data };
              } catch (err) {
                console.error(
                  `Failed to fetch insights for post ${post.name}:`,
                  err.message
                );
                return { ...post, insights: null };
              }
            })
          );

          // Add posts with insights to the allPosts array
          allPosts.push({
            locationName: location.name,
            locationDetails: location,
            posts: postsWithInsights,
          });
        } catch (postError) {
          console.error(
            `Error fetching posts for location ${location.name}:`,
            postError.message
          );
        }
      }
    }

    res.status(200).json({ posts: allPosts });
  } catch (error) {
    console.error(
      "Error fetching all posts:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: error.response?.data || "Internal server error." });
  }
});

// Get Posts and Analysis for a Location
router.get(
  "/gmb/location/:locationId/posts",
  isSessionValid,
  async (req, res) => {
    const { locationId } = req.params;

    try {
      // Fetch the user's access token
      const user = await User.findById(req.user._id);
      if (!user || !user.gmbAccessToken) {
        return res.status(401).json({ error: "No GMB account linked." });
      }

      const accessToken = user.gmbAccessToken;

      const response = await axios.get(
        `https://mybusiness.googleapis.com/v4/${locationId}/localPosts`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const posts = response.data.localPosts || [];

      // Fetch insights for each post
      const postInsights = await Promise.all(
        posts.map(async (post) => {
          try {
            const insightsResponse = await axios.get(
              `https://mybusiness.googleapis.com/v4/${post.name}/insights`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            return { ...post, insights: insightsResponse.data };
          } catch (err) {
            console.error(
              `Failed to fetch insights for post ${post.name}:`,
              err.message
            );
            return { ...post, insights: null };
          }
        })
      );

      res.status(200).json({ posts: postInsights });
    } catch (error) {
      console.error(
        "Error fetching GMB posts:",
        error.response?.data || error.message
      );
      res
        .status(500)
        .json({ error: error.response?.data || "Internal server error." });
    }
  }
);

// Get Locations for the User
router.get("/locations", isSessionValid, async (req, res) => {
  console.log("getting users business location ....");
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.gmbRefreshToken) {
      return res.status(401).json({ error: "No GMB account linked." });
    }

    const refreshToken = user.gmbRefreshToken;

    // Exchange refresh token for a new access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        },
      }
    );

    console.log("getting token response ....");

    const accessToken = tokenResponse.data.access_token;

    console.log("Access Token:", accessToken);

    // Fetch the user's GMB accounts
    const accountsResponse = await axios.get(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const accounts = accountsResponse.data.accounts || [];
    const locations = [];

    console.log("getting locations response ....");

    for (const account of accounts) {
      try {
        console.log(`Fetching locations for account: ${account.name}`);
        const locationResponse = await axios.get(
          `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${account.name}/locations?readMask=storeCode,name,locationName`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        locations.push(...(locationResponse.data.locations || []));
      } catch (error) {
        console.error(
          `Error fetching locations for account ${account.name}:`,
          error.response?.data || error.message
        );
      }
    }

    res.status(200).json({ locations });
  } catch (error) {
    console.error(
      "Error fetching GMB accounts:",
      error.response?.data || error.message
    );

    res
      .status(500)
      .send({ error: error.response?.data ?? "Internal server error." });
  }
});

module.exports = router;
