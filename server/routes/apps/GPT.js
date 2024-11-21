const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const axios = require("axios");
const connectDB = require("../../data/db");
const User = require("../../model/User");

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
const CHATGPT_API_KEY = "sk-proj-AkkZwK2-ScJvUiWiZUOv4pIE6nvnKspyw-MvlP5BaUq7C3tIZDPKhn7\_YrZpPOv-5rYw6Ki8f7T3BlbkFJwm-EAm1CEv3teFGXLaG1BKV0P59E2oOkUIhEDRABHDlWjS5ZeslsrdV\_dqcFZGbQvonRuD5F0A";

// stupid gpt
const API_TOKEN = "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";
const MODEL_URL =
  "https://api-inference.huggingface.co/models/openai-community/gpt2";

// Check if session token is valid
const isSessionValid = (req, res, next) => {
  connectDB();
  console.log("Validating session");
  console.log("Cookies:", req.cookies); // Check all cookies received
  const { sessionToken } = req.cookies;

  if (!sessionToken) {
    console.log("No session token provided");
    return res.status(401).json({ error: "No session token provided." });
  }

  User.findOne({ sessionToken })
    .then((user) => {
      if (!user) {
        console.log("Invalid session token.");
        return res.status(401).json({ error: "Invalid session token." });
      }

      const expirationTime = new Date(user.sessionExpiresAt);
      const currentTime = new Date();
      if (expirationTime <= currentTime) {
        return res.status(401).json({ error: "Session expired." });
      }

      req.user = user;
      next();
    })
    .catch((error) => {
      console.error("Error checking session validity:", error);
      res.status(500).json({ error: "Server error" });
    });
};

// POST generation route
router.get("/generate-posts", isSessionValid, async (req, res) => {
  try {
    const user = req.user;
    const subscriptionPlan = user.subscription?.plan || "basic";
    const companyDetails = user.companiesdetails;

    if (!companyDetails || !subscriptionPlan) {
      return res
        .status(400)
        .json({ error: "Missing company details or subscription plan" });
    }

    const postLimit =
      {
        basic: 7,
        standard: 20,
        premium: 30,
      }[subscriptionPlan] || 7;

    const posts = [];

    for (let i = 0; i < postLimit; i++) {
      const generatedPost = await generatePost(companyDetails);
      posts.push(generatedPost);
    }

    res.json(posts); // Send response to frontend
  } catch (error) {
    console.error("Error generating posts:", error);
    res.status(500).json({ error: "Failed to generate posts" });
  }
});

// Function to call ChatGPT API
async function generatePost(companyDetails) {
  const response = await fetch(CHATGPT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHATGPT_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that generates social media posts with JSON output. Each post should have a caption and Konva-compatible layout data.",
        },
        {
          role: "user",
          content: `Create a post for the following company details:
- Name: ${companyDetails.companyTradeName}
- Sector: ${companyDetails.businessSector}
- Slogan: ${companyDetails.motto}
- Highlight: ${companyDetails.highlight}
- Star Product: ${companyDetails.star_product}
- Communication Style: ${companyDetails.communication_style}
        `,
        },
      ],
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0]?.message?.content);
}

// stupid route
// Function to generate text
async function generateText(prompt) {
  try {
    const response = await axios.post(
      MODEL_URL,
      { inputs: prompt },
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
}

// Function to create a prompt from CompanyDetails
function createPrompt(companyDetails) {
  const {
    userName,
    companyTradeName,
    businessSector,
    motto,
    star_product,
    contactInfo,
  } = companyDetails;

  return `
  Create a compelling social media post for ${userName || "a business"}.
  Business Name: ${companyTradeName || "N/A"}
  Sector: ${businessSector || "N/A"}
  Motto: ${motto || "N/A"}
  Star Product: ${star_product || "N/A"}
  Contact Info: ${contactInfo || "N/A"}
  Highlight key benefits and call to action for the audience.
  `;
}

// POST route to generate posts
router.post("/generate-stupid-posts", isSessionValid, async (req, res) => {
  console.log("generating stupid posts......");
  try {
    const user = req.user; // User is already validated by middleware
    const { companyDetails, subscription } = user;

    if (!companyDetails) {
      return res.status(400).json({ error: "Company details are required." });
    }

    if (!subscription || !subscription.active) {
      return res
        .status(400)
        .json({ error: "User does not have an active subscription." });
    }

    // Determine the number of posts based on the subscription plan
    const postsToGenerate =
      {
        basic: 7,
        standard: 20,
        premium: 30,
      }[subscription.plan.toLowerCase()] || 0;

    if (postsToGenerate === 0) {
      return res.status(400).json({ error: "Invalid subscription plan." });
    }

    // Generate posts
    const prompt = createPrompt(companyDetails);
    const generatedPosts = [];

    for (let i = 0; i < postsToGenerate; i++) {
      const generatedText = await generateText(prompt);
      generatedPosts.push(generatedText); // Collect each generated post
    }

    console.log("generated posts...........");

    res.json({ posts: generatedPosts }); // Return all generated posts
  } catch (error) {
    console.error("Error in generate-posts route:", error);
    res.status(500).json({ error: "Failed to generate posts." });
  }
});

module.exports = router;
