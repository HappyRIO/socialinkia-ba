const { createCanvas } = require("canvas");
const fs = require("fs");

// Konva-like data
const data = [
  {
    type: "rect",
    x: 0,
    y: 0,
    width: 600,
    height: 800,
    fill: "black",
  },
  {
    type: "rect",
    x: 20,
    y: 20,
    width: 560,
    height: 760,
    fillLinearGradientStartPoint: {
      x: 20,
      y: 20,
    },
    fillLinearGradientEndPoint: {
      x: 580,
      y: 780,
    },
    fillLinearGradientColorStops: [0, "orange", 1, "black"],
    shadowColor: "black",
    shadowBlur: 10,
  },
  {
    type: "text",
    x: 100,
    y: 50,
    text: "razor tech",
    fontSize: 36,
    fontFamily: "Calibri",
    fill: "white",
  },
  {
    type: "text",
    x: 50,
    y: 100,
    text: "Making the best, fast and user-friendly",
    fontSize: 32,
    fontFamily: "Calibri",
    fill: "white",
  },
  {
    type: "text",
    x: 200,
    y: 200,
    text: "Web Apps That Soar",
    fontSize: 42,
    fontFamily: "Calibri",
    fill: "black",
    opacity: 0.8,
  },
  {
    type: "text",
    x: 100,
    y: 300,
    text: "IT Services\nCreativity\nInnovation\nTechnology",
    fontSize: 28,
    lineHeight: 1.2,
    fontFamily: "Calibri",
    fill: "white",
    align: "center",
  },
];

// Create a canvas
const width = 800; // Adjust based on content
const height = 1200; // Adjust based on content
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
