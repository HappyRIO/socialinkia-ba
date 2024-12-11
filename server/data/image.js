const { OpenAI } = require("openai"); // Import OpenAI from openai package

// Create an OpenAI instance with API key
const openai = new OpenAI({
  apiKey: process.env.GPT_API_KEY, // Your OpenAI API Key
});

async function generateImage() {
  try {
    const response = await openai.images.create({
      prompt: "A futuristic city with flying cars at sunset",
      n: 1, // Number of images to generate
      size: "1024x1024", // Size of the image
    });
    console.log(response.data[0].url); // URL of the generated image
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

generateImage();
