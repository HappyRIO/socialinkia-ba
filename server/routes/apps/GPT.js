const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const axios = require("axios");
const isSessionValid = require("../../middleware/isSessionValid");

const CHATGPT_API_URL = "https://api.openai.com/v1/chat/completions";
const CHATGPT_API_KEY = process.env.GPT_API_KEY;

// Test route
router.get("/gen", async (req, res) => {
  try {
    // Access the query parameter "aiText"
    const aiText = req.query.aiText;

    if (!aiText) {
      return res
        .status(400)
        .json({ success: false, message: "aiText parameter is required" });
    }

    // Example request body for OpenAI API
    const requestBody = {
      model: "gpt-3.5-turbo", // Update to the model you're using
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: aiText }, // Use the aiText parameter
      ],
      max_tokens: 50,
    };

    // Make a POST request to the ChatGPT API
    const response = await axios.post(CHATGPT_API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CHATGPT_API_KEY}`,
      },
    });

    // Send the API response back to the client
    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error interacting with ChatGPT API:", error.message);

    // Handle errors and return an appropriate response
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST generation route
router.get("/generate-posts", isSessionValid, async (req, res) => {
  console.log("processing ai text .....");
  try {
    const user = req.user;
    const aitext = req.query.aitext; // Correct query parameter usage
    const companyDetails = user.companyDetails;

    console.log({ aitext: aitext });

    if (!companyDetails) {
      return res.status(400).json({ error: "Missing company details" });
    }

    // Generate a single post
    const generatedPost = await generatePost(companyDetails, aitext);

    res.json(generatedPost); // Send the single post to frontend
  } catch (error) {
    console.error("Error generating post:", error);
    res.status(500).json({ error: "Failed to generate post" });
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
            'You are an AI that generates social media posts content and images like a pro graphics designer in JSON for konva to process and convert to image. Each post must include a \'caption\' (a string) and \'konva\' (an array of design elements). The \'konva\' array must include objects representing shape elements (like rectangles, text, and other shapes), with a consistent and stable structure for easy parsing. Each element in the \'konva\' array should include a \'type\' field specifying the shape (e.g., \'rect\', \'text\'), followed by properties like \'x\', \'y\', \'width\', \'height\', \'text\', \'fontSize\', \'fill\', etc., depending on the shape type. The JSON output must look like this example and follow the same structure for every post:\n\n{\n  "caption": "Your generated caption here",\n  "konva": [\n    {"type": "rect", "x": 10, "y": 20, "width": 100, "height": 50, "fill": "blue"},\n    {"type": "text", "x": 20, "y": 30, "text": "Your text here", "fontSize": 18, "fill": "black"}\n  ]\n}\n\nAlways ensure the JSON is valid and adheres to this structure.',
        },
        {
          role: "user",
          content: `Create a post for the following company details:
- Name: ${companyDetails.companyTradeName}
- Sector: ${companyDetails.businessSector}
- Slogan: ${companyDetails.motto_field}
- Highlight: ${companyDetails.highlight}
- Business defination: ${companyDetails.business_definition}
- Communication Style: ${companyDetails.communication_style}
- Extra information: ${aitext},
you dont always need to add the company details in the image, make the images like a good graphics design, and make the image have more hight than width since it for social media post, add shapes text colors and dont just make them static and some dynamics, you can add extra konva attributes to the elements to get the best post design.
dont forget, you can add opacity, shadow and different text styles make the image dynamic, dont forget you can use gradient colors,
        `,
        },
      ],
    }),
  });

  const rawData = await response.json();
  const messageContent = rawData.choices[0]?.message?.content;
  // Attempt to parse the JSON output
  try {
    return JSON.parse(messageContent);
  } catch (err) {
    console.error("Invalid JSON received from OpenAI:", messageContent);
    return {
      caption: "Failed to generate post. Please try again.",
      layout: {},
    };
  }
}

module.exports = router;
