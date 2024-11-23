const { createCanvas } = require("canvas");
const fs = require("fs");

// Konva-like data
const data = [
  { type: "rect", x: 10, y: 10, width: 650, height: 330, fill: "#ffd500" },
  {
    type: "text",
    x: 20,
    y: 50,
    text: "Razor Tech",
    fontSize: 35,
    fill: "black",
  },
  {
    type: "text",
    x: 20,
    y: 90,
    text: "Sector: IT Services",
    fontSize: 20,
    fill: "black",
  },
  {
    type: "text",
    x: 20,
    y: 130,
    text: "Slogan: Making the best, that is fast and does not make client furious",
    fontSize: 18,
    fill: "black",
  },
  {
    type: "text",
    x: 20,
    y: 170,
    text: "Highlight: We make web apps that are fast and speedy",
    fontSize: 18,
    fill: "black",
  },
  {
    type: "text",
    x: 20,
    y: 210,
    text: "Our Definition: Creativity, Innovation, Technology",
    fontSize: 18,
    fill: "black",
  },
  {
    type: "text",
    x: 20,
    y: 250,
    text: "Style: Communicating in a friendly manner",
    fontSize: 18,
    fill: "black",
  },
  {
    type: "text",
    x: 20,
    y: 290,
    text: "Remember...",
    fontSize: 24,
    fill: "#ff0000",
  },
  {
    type: "text",
    x: 20,
    y: 330,
    text: "When you need it fast & reliable, think Razor Tech!",
    fontSize: 24,
    fill: "#ff0000",
  },
];

// Create a canvas
const width = 700; // Adjust based on content
const height = 400; // Adjust based on content
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Helper function to draw each element
function drawElement(ctx, element) {
  if (element.type === "rect") {
    ctx.fillStyle = element.fill || "black";
    ctx.fillRect(element.x, element.y, element.width, element.height);
  } else if (element.type === "text") {
    ctx.fillStyle = element.fill || "black";
    ctx.font = `${element.fontSize || 16}px Arial`;
    ctx.fillText(element.text, element.x, element.y);
  }
}

// Draw all elements
data.forEach((element) => drawElement(ctx, element));

// Save as an image
const buffer = canvas.toBuffer("image/png");
fs.writeFileSync("output.png", buffer);
console.log("Image saved as output.png");
