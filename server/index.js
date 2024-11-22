const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

const connectDB = require("./data/db");
const { connectCloudinary } = require("./data/file");
// Initialize express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); // Parse cookies
app.use(
  session({
    secret: "your-secret-key", // Replace with a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `true` if using HTTPS
  })
);

connectCloudinary();
connectDB();

// List of allowed origins (add any trusted origins as needed)
const allowedOrigins = [process.env.CLIENT_BASE_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from allowed origins or no origin (same-origin requests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Block any other origin
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200, // For handling preflight requests
  })
);

// Routes
const google = require("./routes/auth/Google");
const mainauth = require("./routes/auth/Mainauth");
const facebook = require("./routes/apps/Facebook");
const instagram = require("./routes/apps/Instagram");
const templateRoutes = require("./routes/apps/template");
const contactRoutes = require("./routes/forms/contact");
const paymentRoutes = require("./routes/apps/Stripe");
const PostRoutes = require("./routes/apps/PostManager");
const GmbRoutes = require("./routes/apps/Gmb");
const GptRoute = require("./routes/apps/GPT");

// Test route
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.get("/dashboard", (req, res) => {
  res.redirect(`${process.env.CLIENT_BASE_URL}/dashboard`);
});

// Main routes
app.use("/api/google", google);
app.use("/api/auth", mainauth);
app.use("/api/facebook", facebook);
app.use("/api/instagram", instagram);
app.use("/api/templates", templateRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/subscription", paymentRoutes);
app.use("/api/posts", PostRoutes);
app.use("/api/gmb", GmbRoutes);
app.use("/api/gpt", GptRoute);

// Start server
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
