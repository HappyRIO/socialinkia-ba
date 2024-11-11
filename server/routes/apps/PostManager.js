const express = require("express");
const connectDB = require("../../data/db");
const User = require("../../model/User");
const { cloudinary, connectCloudinary } = require("../../data/file");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

// Middleware to validate user session
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

// Helper function to upload images to Cloudinary
const uploadImagesToCloudinary = async (images) => {
  const urls = [];
  for (const image of images) {
    const result = await cloudinary.uploader.upload(image.path, {
      folder: "automedia",
    });
    urls.push(result.secure_url);
  }
  return urls;
};

// Create a new post
router.post(
  "/create",
  isSessionValid,
  upload.array("images"),
  async (req, res) => {
    connectDB();
    connectCloudinary();

    try {
      const { text, uploadDate, platform } = req.body;
      const images = req.files; // Assuming Multer stores files in req.files

      console.log({ text, uploadDate, platform });

      // Check if files are received properly
      if (!images || images.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      // If platform is a string, parse it into an object
      let parsedPlatform = platform;
      if (typeof platform === "string") {
        parsedPlatform = JSON.parse(platform);
      }

      console.log("processing image........");
      // Process and upload images to Cloudinary
      const uploadedImageUrls = await uploadImagesToCloudinary(images);

      console.log("creating post........");
      // Add the new post to the user's posts
      const newPost = {
        text,
        uploaddate: uploadDate,
        images: uploadedImageUrls,
        platform: parsedPlatform, // Use parsed platform here
      };

      req.user.post.push(newPost); // Add new post to user's posts array
      await req.user.save();
      res
        .status(201)
        .json({ message: "Post created successfully", post: newPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error, unable to upload images",
      });
    }
  }
);

// Get all posts from a user
router.get("/all", isSessionValid, async (req, res) => {
  connectDB();

  try {
    const user = await User.findById(req.user._id).select("post");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Ensure that the response is always an array
    const posts = Array.isArray(user.post) ? user.post : [user.post];
    res.json({ posts });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ error: "Failed to retrieve posts." });
  }
});

// Get a post by ID
router.get("/:postId", isSessionValid, async (req, res) => {
  connectDB();

  try {
    const postId = req.params.postId;

    // Find the post with the matching ID in the user's post array
    const post = req.user.post.find((p) => p._id.toString() === postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.json({ post });
  } catch (error) {
    console.error("Error retrieving post by ID:", error);
    res.status(500).json({ error: "Failed to retrieve post." });
  }
});


// Update a post
router.put("/:postId", isSessionValid, async (req, res) => {
  connectDB();
  console.log("updating image...");
  try {
    if (req.user.post._id != req.params.postId) {
      return res.status(404).json({ message: "Post not found." });
    }

    const { text, uploaddate, images } = req.body;

    // Process and upload images if provided
    const uploadedImageUrls = images
      ? await uploadImagesToCloudinary(images)
      : req.user.post.images;

    // Update post fields
    req.user.post = {
      ...req.user.post.toObject(),
      text,
      uploaddate,
      images: uploadedImageUrls,
    };
    await req.user.save();

    res.json({ message: "Post updated successfully", post: req.user.post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post." });
  }
});

// Delete a post
router.delete("/delete/:postId", isSessionValid, async (req, res) => {
  connectDB();

  try {
    if (req.user.post._id != req.params.postId) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Delete images from Cloudinary in the 'automedia' folder
    for (const imageUrl of req.user.post.images) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`automedia/${publicId}`);
    }

    // Remove post from user
    req.user.post = null;
    await req.user.save();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post." });
  }
});

module.exports = router;
