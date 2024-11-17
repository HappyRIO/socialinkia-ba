const express = require("express");
const querystring = require("querystring");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const connectDB = require("../../data/db");
const router = express.Router();
const User = require("../../model/User");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const googleScopes = ["openid", "profile", "email"];

// Login route
router.get("/auth/google/login", (req, res) => {
  const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth?";
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: `${process.env.SERVER_BASE_URL}/api/google/auth/google/login/callback`,
    response_type: "code",
    scope: googleScopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    state: JSON.stringify({ flow: "login" }),
  });

  console.log("Redirecting to Google OAuth for login with query:", queryParams);
  res.redirect(`${authEndpoint}${queryParams}`);
});

// Signup route
router.get("/auth/google/signup", (req, res) => {
  const { plan } = req.query;
  const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth?";
  const queryParams = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: `${process.env.SERVER_BASE_URL}/api/google/auth/google/signup/callback`,
    response_type: "code",
    scope: googleScopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    state: JSON.stringify({ flow: "signup", plan }),
  });

  console.log(`Redirecting to Google OAuth for signup with plan: ${plan}`);
  res.redirect(`${authEndpoint}${queryParams}`);
});

// Google OAuth callback route (handles both login and signup)
router.get("/auth/google/:flow/callback", async (req, res) => {
  console.log({ message: "processing call back ................." });
  const { code, state } = req.query;

  if (!code) {
    console.log("Authorization code missing.");
    return res.status(400).json({ error: "Authorization code missing." });
  }

  if (!state) {
    console.log("Authorization state missing.");
    return res.status(400).json({ error: "Authorization state missing." });
  }

  connectDB();

  const { flow, plan } = JSON.parse(state);

  console.log(flow, plan);

  console.log(`Flow type: ${flow}`); // "login" will be printed if it's a login
  // Parse state
  if (flow === "signup") {
    console.log(`Flow type: ${flow}, Plan: ${plan}`); // "signup" and plan will be printed
  }

  const tokenEndpoint = "https://oauth2.googleapis.com/token";

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing." });
  }

  const requestBody = querystring.stringify({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: `${process.env.SERVER_BASE_URL}/api/google/auth/google/${flow}/callback`,
    grant_type: "authorization_code",
  });

  try {
    const response = await axios.post(tokenEndpoint, requestBody, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("Token exchange response:", response.data);
    const { access_token } = response.data;

    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { email, name, picture } = profileResponse.data;
    let user = await User.findOne({ email });

    function generateRandomPassword(length = 12) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
      let password = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }

      return password;
    }

    if (flow === "signup" && !user) {
      const hashedPassword = await bcrypt.hash(generateRandomPassword(), 10);
      user = new User({
        name,
        email,
        picture,
        password: hashedPassword,
        subscription: { plan },
      });
      await user.save();
      console.log({ newUser: user });

      const sessionToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "2h",
      });

      user.sessionToken = sessionToken;
      user.sessionExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
      await user.save();

      res.cookie("sessionToken", sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 60 * 60 * 1000,
      });

      // Determine redirect URL based on flow type
      const redirectUrl =
        flow === "signup"
          ? `${process.env.CLIENT_BASE_URL}/subscription/signup/details`
          : `${process.env.CLIENT_BASE_URL}/dashboard`;

      // Respond with the HTML for the popup window to redirect and close
      return res.status(201).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Redirecting</title>
        </head>
        <body>
            <script>
            if (window.opener) {
                window.opener.postMessage(
                    { redirectUrl: "${redirectUrl}" },
                    "${process.env.CLIENT_BASE_URL}"
                );
                window.close();

                // // Redirect the opener window to the subscription page
                // window.opener.location.href = "${redirectUrl}";
                // // Close the current window
                // window.close();
            } else {
                window.location.href = "${redirectUrl}";
                window.close();
            }
            </script>
        </body>
        </html>
      `);
    } else if (flow === "login" && !user) {
      // Redirect to the subscription page for sign-up
      const redirectUrl = `${process.env.CLIENT_BASE_URL}/subscription`;
      return res.status(303).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redirecting</title>
    </head>
    <body>
        <script>
            if (window.opener && !window.opener.closed) {
                // Redirect the opener window to the subscription page
                window.opener.location.href = "${redirectUrl}";
                // Close the current window
                window.close();
            } else {
                // If opener is unavailable or closed, redirect in the current window
                window.location.href = "${redirectUrl}";
            }
        </script>
    </body>
    </html>
  `);
    } else {
      console.log("User already exists or logging in.");

      const sessionToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "2h",
      });

      user.sessionToken = sessionToken;
      user.sessionExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
      await user.save();

      res.cookie("sessionToken", sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 60 * 60 * 1000,
      });

      // Determine redirect URL based on flow type
      const redirectUrl =
        flow === "signup"
          ? `${process.env.CLIENT_BASE_URL}/subscription/signup/details`
          : `${process.env.CLIENT_BASE_URL}/dashboard`;

      // Respond with the HTML for the popup window to redirect and close
      return res.status(201).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Redirecting</title>
        </head>
        <body>
            <script>
            if (window.opener) {
                window.opener.postMessage(
                    { redirectUrl: "${redirectUrl}" },
                    "${process.env.CLIENT_BASE_URL}"
                );
                window.close();

                // // Redirect the opener window to the subscription page
                // window.opener.location.href = "${redirectUrl}";
                // // Close the current window
                // window.close();
            } else {
                window.location.href = "${redirectUrl}";
                window.close();
            }
            </script>
        </body>
        </html>
      `);
    }
  } catch (error) {
    console.error(
      "Error during Google OAuth callback:",
      error.response ? error.response.data : error.message
    );
    console.error("Full error:", error);
    return res.status(500).json({
      error: "Failed to authenticate with Google.",
      errormessage: error.message,
      fullError: error,
    });
  }
});

module.exports = router;
