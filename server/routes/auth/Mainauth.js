const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../model/User");
const connectDB = require("../../data/db");
const router = express.Router();

router.get("/test", (req, res) => {
  connectDB();
  console.log("connected t db");
});

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

// Register route
router.post("/register", async (req, res) => {
  connectDB();
  console.log("Registering new user");
  const { email, password, subscription } = req.body;

  // Check if email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: "Email already exists." });
  }

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
    subscription: {
      plan: subscription,
    },
  });

  console.log({ hashedPassword: hashedPassword });

  try {
    await newUser.save();

    // Generate session token
    const sessionToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h", // Token expires in 2 hours
      }
    );

    const sessionExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // Session expires in 2 hours

    // Store session token and expiration
    newUser.sessionToken = sessionToken;
    newUser.sessionExpiresAt = sessionExpiresAt;

    await newUser.save();

    // Set session token as an HTTP-only cookie
    res.cookie("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 2 * 60 * 60 * 1000, // Cookie expiration (2 hours)
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user." });
  }
});

// Login route
router.post("/login", async (req, res) => {
  connectDB();
  console.log("Logging in ...");
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "user not found" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "wrong pass" });
  }

  // Generate session token
  const sessionToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h", // Token expires in 2 hours
  });

  const sessionExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // Session expiration (2 hours)

  // Store session token and expiration in user record
  user.sessionToken = sessionToken;
  user.sessionExpiresAt = sessionExpiresAt;

  try {
    await user.save();
    res.cookie("sessionToken", sessionToken, {
      httpOnly: true,
      secure: true,
      // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "none",
      maxAge: 2 * 60 * 60 * 1000, // Cookie expiration (2 hours)
    });

    res.json({
      message: "Login successful",
      sessionToken, // Send token in response
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to save session data." });
  }
});

// Session refresh route (validates session and refreshes token)
router.post("/refresh-session", isSessionValid, async (req, res) => {
  console.log("Refreshing session...");
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
        expiresIn: "2h", // Token expires in 2 hours
      }
    );

    res.cookie("sessionToken", newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
    });

    res.json({
      message: "Session refreshed",
      sessionToken: newSessionToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to refresh session." });
  }
});

// Check if user is logged in and session is valid
router.get("/check-user", isSessionValid, (req, res) => {
  connectDB();
  res.status(201).json({
    message: "User is registered and session is valid",
    user: {
      email: req.user.email,
      userId: req.user._id,
    },
  });
});

// Get user information
router.get("/user/details", isSessionValid, async (req, res) => {
  connectDB();
  try {
    const user = await User.findById(req.user._id).select(
      "-password -sessionToken"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      message: "User information retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error retrieving user information:", error);
    res.status(500).json({ error: "Failed to retrieve user information." });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/photos/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.put(
  "/user/details",
  isSessionValid,
  upload.array("photos"),
  async (req, res) => {
    try {
      const {
        email,
        deleted,
        // subscription,
        createdAt,
        sessionToken,
        sessionExpiresAt,
        name,
        companyCreationDate,
        slogan,
        numEmployees,
        contactInfo,
        businessPurpose,
        preferredLanguage,
      } = req.body;

      const photos = req.files.map((file) => file.path);

      // Prepare an update object with all fields
      const updateData = {
        email,
        deleted: deleted === "true", // Convert to Boolean if passed as string
        // subscription: subscription === "true",
        createdAt,
        sessionToken,
        sessionExpiresAt,
        companyDetails: {
          name,
          companyCreationDate,
          slogan,
          numEmployees: parseInt(numEmployees, 10), // Ensure this is an integer
          contactInfo,
          businessPurpose,
          preferredLanguage,
          photos,
        },
      };

      // Update user details with validation
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        message: "User details updated successfully",
        updatedUser,
      });
    } catch (error) {
      console.error("Error updating user details:", error);
      res.status(500).json({ error: "Failed to update user details" });
    }
  }
);

module.exports = router;
