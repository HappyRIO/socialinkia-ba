const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Initialize express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); // Parse cookies

console.log(process.env.ACCEPTED_ORIGIN);
// CORS configuration (for local development)
app.use(
  cors({
    origin: (origin, callback) => {
      // If no origin is provided (e.g., for same-origin requests), allow it
      if (!origin || origin === process.env.ACCEPTED_ORIGIN) {
        return callback(null, true); // Allow the specified origin
      }
      // Block any other origin
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true, // Allow cookies to be sent
  })
);

// Routes
const google = require("./routes/auth/Google");
const mainauth = require("./routes/auth/Mainauth");
const facebook = require("./routes/apps/Facebook");
const instagram = require("./routes/apps/Instagram");
const templateRoutes = require("./routes/apps/template");
const contactRoutes = require("./routes/forms/contact");

// Test route
app.get("/", (req, res) => {
  console.log({ request: "get info" });
  res.json({ message: "hello world" });
});

// Main routes
app.use("/api/google", google);
app.use("/api/auth", mainauth);
app.use("/api/facebook", facebook);
app.use("/api/instagram", instagram);
app.use("/api/templates", templateRoutes);
app.use("/api/contact", contactRoutes)

// Start server
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
