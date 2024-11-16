const express = require("express");
const fetch = require("node-fetch");
const app = express();

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
const CHATGPT_API_KEY = "your-api-key";

const userDetails = {
  companyName: "Example Corp",
  slogan: "Innovating the Future",
  subscriptionPlan: "Standard", // Use Basic, Standard, or Premium
  products: ["Smartphones", "Accessories"],
};

// Generate Post Content and Konva Data
async function generatePost(details) {
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
            "You are an AI assistant generating social media posts for businesses with JSON-formatted output compatible with Konva. Include captions with hashtags and a `konvaData` object for layout design.",
        },
        {
          role: "user",
          content: `Generate a post for the following details:
- Company Name: ${details.companyName}
- Slogan: ${details.slogan}
- Products: ${details.products.join(", ")}
- Subscription Plan: ${details.subscriptionPlan}`,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0]?.message?.content;
}

// API Endpoint
app.get("/generate-posts", async (req, res) => {
  try {
    const postLimit =
      {
        Basic: 7,
        Standard: 20,
        Premium: 30,
      }[userDetails.subscriptionPlan] || 7;

    const posts = [];
    for (let i = 0; i < postLimit; i++) {
      const post = await generatePost(userDetails);
      posts.push(JSON.parse(post)); // Ensure valid JSON format
    }

    res.json(posts); // Return the JSON response
  } catch (error) {
    console.error("Error generating posts:", error);
    res.status(500).json({ error: "Failed to generate posts" });
  }
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
