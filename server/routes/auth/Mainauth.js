const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../model/User");
const connectDB = require("../../data/db")
const router = express.Router();

const isSessionValid = (req, res, next) => {
  connectDB();
  const { sessionToken } = req.cookies;

  if (!sessionToken) {
    return res.status(401).json({ error: "No session token provided." });
  }

  User.findOne({ sessionToken })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Invalid session token." });
      }

      const expirationTime = new Date(user.sessionExpiresAt);
      const currentTime = new Date();
      const timeDifference = expirationTime - currentTime;

      if (timeDifference <= 0) {
        return res.status(401).json({ error: "Session expired." });
      }

      req.user = user;
      next();
    })
    .catch((error) => {
      console.error("Error checking session validity:", error); // Log the error
      res.status(500).json({ error: "Server error" });
    });
};

// Register Route
router.post("/register", async (req, res) => {
  connectDB();
  const { email, password } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists." });
  }

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  connectDB();
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  // Generate session token and set expiration time (2 hours)
  const sessionToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h", // Token expires in 2 hours
  });

  const sessionExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // Session expiration time (2 hours)

  // Store sessionToken and sessionExpiresAt in the user's record
  user.sessionToken = sessionToken;
  user.sessionExpiresAt = sessionExpiresAt;

  try {
    await user.save();
    res.cookie("sessionToken", sessionToken, { httpOnly: true, secure: true }); // Set session cookie

    res.json({
      message: "Login successful",
      sessionToken, // Send token in response
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to save session data." });
  }
});

// Refresh Session Route (Called whenever user interacts with the server)
router.post("/refresh-session", isSessionValid, async (req, res) => {
  connectDB();
  const { sessionToken } = req.cookies;

  // Create a new session with a new expiration time
  const sessionExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
  req.user.sessionExpiresAt = sessionExpiresAt;

  try {
    await req.user.save();

    // Regenerate session token
    const newSessionToken = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.cookie("sessionToken", newSessionToken, {
      httpOnly: true,
      secure: true,
    });
    res.json({
      message: "Session refreshed",
      sessionToken: newSessionToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to refresh session." });
  }
});

// Check if user is registered and session is valid
router.get("/check-user", isSessionValid, (req, res) => {
  consoel.log("validating user");
  connectDB();
  res.json({
    message: "User is registered and session is valid",
    user: {
      email: req.user.email,
      userId: req.user._id,
    },
  });
});

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/photos/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// PUT route to update company details
router.put(
  "/details",
  isSessionValid,
  upload.array("photos"),
  async (req, res) => {
    connectDB();
    try {
      const {
        name,
        companyCreationDate,
        slogan,
        numEmployees,
        contactInfo,
        businessPurpose,
        preferredLanguage,
      } = req.body;

      // Map uploaded files to photo paths
      const photos = req.files.map((file) => file.path);

      // Find and update user's company details
      await User.findByIdAndUpdate(
        req.session.userId, // Ensure you have `userId` stored in session
        {
          companyDetails: {
            name,
            companyCreationDate,
            slogan,
            numEmployees: parseInt(numEmployees),
            contactInfo,
            businessPurpose,
            photos,
            preferredLanguage,
          },
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({ message: "Company details updated successfully" });
    } catch (error) {
      console.error("Error updating company details:", error);
      res.status(500).json({ error: "Failed to update company details" });
    }
  }
);

module.exports = router;
