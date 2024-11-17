const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../model/User");
const connectDB = require("../../data/db");
const router = express.Router();
const { cloudinary, connectCloudinary } = require("../../data/file");
const { Readable } = require("stream");
const multer = require("multer");

// Multer configuration for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/test", (req, res) => {
  connectDB();
  console.log("connected t db");
});

const uploadImagesToCloudinary = async (files) => {
  if (!files || (!Array.isArray(files) && !files.buffer)) {
    console.error("No valid files to upload.");
    return [];
  }

  const fileArray = Array.isArray(files) ? files : [files]; // Ensure files is always an array
  console.log("Uploading images to Cloudinary...");

  const urls = [];
  for (const file of fileArray) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "automedia" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );

      // Convert buffer to readable stream and pipe to Cloudinary
      Readable.from(file.buffer).pipe(stream);
    });
    urls.push(result);
  }

  console.log("Uploaded image URLs:", urls);
  return urls;
};

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

  if (!password) {
    return res.status(401).json({ error: "No passward provided" });
  }

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

//update user information
router.put(
  "/user/details",
  isSessionValid,
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "logo", maxCount: 1 },
    { name: "exterior_photo", maxCount: 1 },
    { name: "interior_photo", maxCount: 1 },
    { name: "special_place_photo", maxCount: 1 },
    { name: "staff_photo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        userName,
        companyTradeName,
        businessSector,
        addressVisible,
        country,
        province,
        locality,
        postalCode,
        webPage,
        webPageUrl,
        showContactInfo,
        contactInfo,
        schedule,
        sales_channels,
        motto,
        motto_field,
        business_definition,
        business_definition_other,
        highlight,
        star_product,
        star_product_field,
        features,
        add_products,
        add_products_field,
        add_features,
        objectives,
        area_of_influence,
        customer_type,
        age_range,
        valuable_content,
        valuable_content_other,
        communication_style,
        communication_style_other,
      } = req.body;

      console.log("Request body:", req.body);
      console.log("Uploaded files:", req.files);

      connectCloudinary();

      // Ensure companyDetails exists before accessing its properties
      const companyDetails = req.user.companyDetails || {};

      // Handle uploaded images
      const newPhotos = req.files.photos || [];
      const newLogo = req.files.logo ? req.files.logo[0] : "";
      const newExteriorPhoto = req.files.exterior_photo
        ? req.files.exterior_photo[0]
        : null;
      const newInteriorPhoto = req.files.interior_photo
        ? req.files.interior_photo[0]
        : null;
      const newSpecialPlacePhoto = req.files.special_place_photo
        ? req.files.special_place_photo[0]
        : null;
      const newStaffPhoto = req.files.staff_photo
        ? req.files.staff_photo[0]
        : null;

      // Upload new images to Cloudinary
      const newPhotoUrls =
        newPhotos.length > 0 ? await uploadImagesToCloudinary(newPhotos) : [];
      const logoUrl = newLogo
        ? await uploadImagesToCloudinary(newLogo).then((urls) => urls[0])
        : ""; // Ensure this is a single URL

      // For each photo, check if it exists, and either upload or use the existing one
      const exteriorPhotoUrl = newExteriorPhoto
        ? await uploadImagesToCloudinary(newExteriorPhoto)
        : companyDetails.exterior_photo || "";

      const interiorPhotoUrl = newInteriorPhoto
        ? await uploadImagesToCloudinary(newInteriorPhoto)
        : companyDetails.interior_photo || "";

      const specialPlacePhotoUrl = newSpecialPlacePhoto
        ? await uploadImagesToCloudinary(newSpecialPlacePhoto)
        : companyDetails.special_place_photo || "";

      const staffPhotoUrl = newStaffPhoto
        ? await uploadImagesToCloudinary(newStaffPhoto)
        : companyDetails.staff_photo || "";

      // Identify removed images and delete from Cloudinary
      const existingPhotos = companyDetails.photos || [];
      const retainedPhotos = req.body.photos || [];
      const removedPhotos = existingPhotos.filter(
        (img) => !retainedPhotos.includes(img)
      );

      if (removedPhotos.length > 0) {
        await deleteImagesFromCloudinary(removedPhotos);
      }

      // Prepare update data
      const updateData = {
        companyDetails: {
          userName,
          logo: logoUrl || companyDetails.logo,
          companyTradeName,
          businessSector,
          addressVisible,
          country,
          province,
          locality,
          postalCode,
          webPage,
          webPageUrl,
          showContactInfo,
          contactInfo,
          schedule,
          sales_channels,
          motto,
          motto_field,
          business_definition: parseJSON(business_definition),
          business_definition_other,
          highlight,
          star_product,
          star_product_field,
          features,
          add_products,
          add_products_field,
          add_features,
          objectives,
          photos: [...retainedPhotos, ...newPhotoUrls],
          exterior_photo: exteriorPhotoUrl,
          interior_photo: interiorPhotoUrl,
          special_place_photo: specialPlacePhotoUrl,
          staff_photo: staffPhotoUrl,
          area_of_influence,
          customer_type: parseJSON(customer_type),
          age_range: parseJSON(age_range),
          valuable_content: parseJSON(valuable_content),
          valuable_content_other,
          communication_style,
          communication_style_other,
        },
      };

      // Helper function to validate and parse JSON strings
      function parseJSON(str) {
        try {
          return JSON.parse(str);
        } catch (e) {
          return []; // Default to an empty array if JSON is invalid
        }
      }

      // Update user document
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
