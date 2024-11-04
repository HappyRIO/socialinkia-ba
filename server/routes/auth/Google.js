const express = require("express");
const querystring = require("querystring");
const axios = require("axios");
const router = express.Router();
const User = require("../../model/User");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Google Client ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRETE; // Google Client Secret
const REDIRECT_URI = process.env.GOOGLE_CLIENT_REDIRECT_URL; // Redirect URI for callback

// Define Google OAuth 2.0 Scopes
const googleScopes = [
  "openid", // Required for ID token
  "profile", // Access to basic profile information
];

// Step 1: Redirect user to Google OAuth endpoint
router.get("/auth/google", (req, res) => {
  const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth?";
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: googleScopes.join(" "),
    access_type: "offline",
    prompt: "consent", // Forces the user to re-approve the app to ensure refresh tokens are granted
  });

  const authUrl = `${authEndpoint}${queryParams}`;
  res.redirect(authUrl);
  // res.redirect(googleAuthUrl);
});

// Endpoint for Google OAuth callback
router.get("/auth/google/callback", async (req, res) => {
  const tokenEndpoint = "https://oauth2.googleapis.com/token";
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  // Prepare request body with URL encoding
  const requestBody = querystring.stringify({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const options = {
    method: "POST",
    url: tokenEndpoint,
    data: requestBody,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };

  try {
    // Exchange authorization code for tokens
    const response = await axios(options);

    const { access_token, id_token, refresh_token, expires_in } = response.data;

    req.session.accessToken = access_token;
    req.session.refreshToken = refresh_token;
    req.session.id_token = id_token;
    req.session.tokenExpiry = Date.now() + expires_in * 1000;

    console.log(
      "Access token:",
      access_token,
      "ID token:",
      id_token,
      "Refresh token:",
      refresh_token,
      "Expiry:",
      expires_in
    );

    res.redirect(`${process.env.FRONTEND_WINDOW_KILLER_URL}`);
  } catch (error) {
    console.error(
      "Error during Google OAuth callback 1:",
      error.response ? error.response.data : error.message
    );
    return res
      .status(500)
      .json({ error: "Failed to authenticate with Google." });
  }
});

// Middleware to check and refresh the token if expired
const ensureAuthenticated = async (req, res, next) => {
  if (isTokenExpired(req.session.tokenExpiry)) {
    try {
      const newAccessToken = await refreshAccessToken(req.session.refreshToken);
      req.session.accessToken = newAccessToken;
      req.session.tokenExpiry = Date.now() + 3600 * 1000; // Assuming 1-hour expiry
    } catch (error) {
      console.error("Error refreshing access token:", error.message);
      return res
        .status(401)
        .json({ error: "Session expired. Please log in again." });
    }
  }
  next();
};

// Function to check if token is expired
const isTokenExpired = (expiryTime) => Date.now() > expiryTime;

// Function to refresh the access token
const refreshAccessToken = async (refreshToken) => {
  const response = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  return response.data.access_token; // Return the new access token
};

// Use middleware in routes where authentication is required
router.get("/user/signup", ensureAuthenticated, async (req, res) => {
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ error: "Access token missing. Please log in." });
  }

  try {
    // Fetch user profile from Google's userinfo endpoint
    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Extract user data from the response
    const { name, picture, email } = profileResponse.data;

    const createUser = new User({
      name,
      password: email,
      picture,
      email,
    });

    // Save the new user to the database
    await createUser.save();

    res.json({
      message: "You have access to this protected route!",
      accessToken,
      user: {
        name,
        email,
        picture,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

//google User login
router.get("/user/login", ensureAuthenticated, async (req, res) => {
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    // Redirect to Google OAuth if no access token is found
    return res.redirect(
      `${process.env.SERVER_BASE_URL}/api/google/auth/google`
    );
  }

  try {
    // Fetch user profile from Google's userinfo endpoint
    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Extract user data from the response
    const { name, picture, email } = profileResponse.data;

    // Check if the user already exists in the database
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if one does not exist
      user = new User({
        name,
        email,
        picture,
      });
      await user.save();
    }

    res.json({
      message: "You have access to this protected route!",
      accessToken,
      user: {
        name,
        email,
        picture,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

module.exports = router;
