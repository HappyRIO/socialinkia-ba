const express = require("express");
const connectDB = require("../../data/db");
const User = require("../../model/User");
const { cloudinary, connectCloudinary } = require("../../data/file");
const { Readable } = require("stream");
const router = express.Router();
const multer = require("multer");

// Multer configuration for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to validate user session
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
      if (expirationTime <= new Date()) {
        return res.status(401).json({ error: "Session expired." });
      }
      req.user = user;
      next();
    })
    .catch((error) => res.status(500).json({ error: "Server error" }));
};

// Helper function to upload images to Cloudinary
const uploadImagesToCloudinary = async (files) => {
  console.log("uploading images to Cloudinary...");
  const urls = [];

  for (const file of files) {
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

//helper function for deleting images
const deleteImagesFromCloudinary = async (imageUrls) => {
  for (const url of imageUrls) {
    const publicId = url.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
    await cloudinary.uploader.destroy(`automedia/${publicId}`);
  }
};

// Create a new post
router.post(
  "/create",
  isSessionValid,
  upload.array("images"), // Ensure the "images" name matches the file input name from the frontend
  async (req, res) => {
    connectDB();
    connectCloudinary();

    try {
      const { text, uploadDate, platform } = req.body;
      const images = req.files;

      console.log({ text, uploadDate, platform });
      console.log("Received images:", images);

      // Check if files are received properly
      if (!images || images.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      // If platform is a string, parse it into an object
      let parsedPlatform = platform;
      if (typeof platform === "string") {
        parsedPlatform = JSON.parse(platform);
      }

      console.log("Processing images...");
      // Process and upload images to Cloudinary
      const uploadedImageUrls = await uploadImagesToCloudinary(images);

      console.log("Creating post...");
      // Add the new post to the user's posts
      const newPost = {
        text,
        uploaddate: uploadDate,
        images: uploadedImageUrls,
        platform: parsedPlatform,
      };

      req.user.post.push(newPost);
      await req.user.save();

      res
        .status(201)
        .json({ message: "Post created successfully", post: newPost });
    } catch (error) {
      console.error("Error creating post:", error);
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

// PUT route to update post by ID
router.put(
  "/:postId",
  isSessionValid,
  upload.array("images"),
  async (req, res) => {
    connectDB();
    connectCloudinary();
    console.log(req.body.images);

    try {
      // Find the post
      const post = req.user.post.find(
        (p) => p._id.toString() === req.params.postId
      );

      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }

      const { text, uploadDate, images: incomingImages } = req.body;

      // Ensure images is an array
      const images = Array.isArray(incomingImages) ? incomingImages : [];

      const existingImages = post.images || [];

      // Define newImages
      const newImages = req.files;

      // Find images to be removed
      const removedImages = existingImages.filter(
        (img) => !images.includes(img)
      );

      // Upload new images to Cloudinary
      const uploadedImageUrls =
        newImages.length > 0 ? await uploadImagesToCloudinary(newImages) : [];

      // Delete removed images from Cloudinary
      if (removedImages.length > 0) {
        await deleteImagesFromCloudinary(removedImages);
      }

      // Update post fields
      post.text = text || post.text;
      post.uploadDate = uploadDate || post.uploadDate;
      post.images = [
        ...existingImages.filter((img) => images.includes(img)),
        ...uploadedImageUrls,
      ];

      await req.user.save();
      res.json({ message: "Post updated successfully", post });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ error: "Failed to update post." });
    }
  }
);

// Delete a post by ID
router.delete("/delete/:postId", isSessionValid, async (req, res) => {
  connectDB();
  connectCloudinary();

  try {
    // Find the post with the matching ID in the user's posts array
    const post = req.user.post.find(
      (p) => p._id.toString() === req.params.postId
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Delete images from Cloudinary
    if (post.images && post.images.length > 0) {
      for (const imageUrl of post.images) {
        if (imageUrl) {
          // Check if imageUrl is not null or undefined
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`automedia/${publicId}`);
        }
      }
    }

    // Remove the post from the user's posts array
    req.user.post = req.user.post.filter(
      (p) => p._id.toString() !== req.params.postId
    );
    await req.user.save();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post." });
  }
});

module.exports = router;
