const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const axios = require("axios");
const isSessionValid = require("../../middleware/isSessionValid");

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
const CHATGPT_API_KEY = process.env.GPT_API_KEY;

// stupid gpt
const API_TOKEN = "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";
const MODEL_URL =
  "https://api-inference.huggingface.co/models/openai-community/gpt2";

// POST generation route
router.get("/generate-posts", isSessionValid, async (req, res) => {
  try {
    const user = req.user;
    const { aitext } = req.params;
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
      const generatedPost = await generatePost(companyDetails, aitext);
      posts.push(generatedPost);
    }

    res.json(posts); // Send response to frontend
  } catch (error) {
    console.error("Error generating posts:", error);
    res.status(500).json({ error: "Failed to generate posts" });
  }
});

// Function to call ChatGPT API
async function generatePost(companyDetails, aitext) {
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
- Text: ${aitext}
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
