const express = require("express");
const connectDB = require("../../data/db");
const User = require("../../model/User");
const { cloudinary, connectCloudinary } = require("../../data/file");
const { Readable } = require("stream");
const router = express.Router();
const multer = require("multer");
const Agenda = require("agenda");
const {
  publishToFacebook,
  publishToInstagram,
  publishToGmb,
} = require("../../handlers/PostRoutesHandler");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize Agenda for scheduling
const agenda = new Agenda({
  db: { address: `${process.env.DATA_BASE_URL}` },
});

// Middleware for session validation
const isSessionValid = async (req, res, next) => {
  try {
    connectCloudinary();
    connectDB();
    const { sessionToken } = req.cookies;

    if (!sessionToken) {
      return res.status(401).json({ error: "No session token provided." });
    }

    const user = await User.findOne({ sessionToken });
    if (!user || new Date(user.sessionExpiresAt) <= new Date()) {
      return res.status(401).json({ error: "Invalid or expired session." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Cloudinary helpers
const uploadImagesToCloudinary = async (files) => {
  console.log("processing images");
  const urls = [];
  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "automedia" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      Readable.from(file.buffer).pipe(stream);
    });
    urls.push(result);
  }
  return urls;
};

const uploadVideosToCloudinary = async (files) => {
  console.log("Processing videos...");
  const urls = [];

  for (const file of files) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "automedia/videos", resource_type: "video" }, // Specify the folder path
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );

      // Stream the file buffer to Cloudinary
      Readable.from(file.buffer).pipe(stream);
    });

    urls.push(result);
  }

  return urls;
};

//helper function for deleting images
async function deleteImagesFromCloudinary(imageUrls) {
  for (const url of imageUrls) {
    const publicId = url.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
    await cloudinary.uploader.destroy(`automedia / ${publicId}`);
  }
}

async function deleteMedia(mediaUrls) {
  try {
    for (const url of mediaUrls) {
      const publicId = url.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
      const resourceType = url.includes("/video/") ? "video" : "image"; // Determine resource type

      if ((resourceType = "video")) {
        console.log("video resourse deleting");
      }

      if ((resourceType = "image")) {
        console.log("image resourse deleting");
      }

      await cloudinary.uploader.destroy(`automedia/${publicId}`, {
        resource_type: resourceType,
      });
    }
  } catch (error) {
    console.error("Error deleting media from Cloudinary:", error);
  }
}

// Schedule a post for publishing
const schedulePost = async (postId, userId) => {
  // Define the publish post job in Agenda
  agenda.define("publish post", async (job) => {
    const { userId, postId } = job.attrs.data;

    // Fetch the user and the specific post by its ID
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const post = user.posts.id(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    try {
      // Publish to platforms based on the post's platform flags
      if (post.platform.fbook) {
        console.log({ message: `posted ${post._id} to fbook for ${user._id}` });
        const fbResult = await publishToFacebook(post, user);
        // post.socialPlatformIds.fbook = fbResult.postId;
        console.log(fbResult);
      }

      if (post.platform.insta) {
        console.log({
          message: `posted ${post._id} to insta for ${user._id}`,
        });
        const instaResult = await publishToInstagram(post, user);
        // post.socialPlatformIds.insta = instaResult.postId;
        console.log(instaResult);
      }

      if (post.platform.gmb) {
        console.log({
          message: `posted ${post._id} to gmb for ${user._id}`,
        });
        const gmbResult = await publishToGmb(post, user);
        // post.socialPlatformIds.gmb = gmbResult.postId;
        console.log(gmbResult);
      }

      // Update post status to "published"
      post.status = "published";
      await user.save(); // Save the updated user document with post details
      console.log("Post published successfully:", postId);
    } catch (error) {
      console.error("Failed to publish post:", error);
      post.status = "failed"; // Set the post status to "failed" if an error occurs
      await user.save(); // Save the post with updated status
    }
  });

  // Fetch the post and schedule the job at the specified time
  const post = await User.findOne({ "posts._id": postId }, { "posts.$": 1 });

  if (!post || !post.posts.length) {
    throw new Error("Post not found or no valid post in the user document.");
  }

  // Schedule the job to run at the post's scheduled upload date
  await agenda.schedule(
    new Date(post.posts[0].uploadDate), // Use the post's upload date as the scheduled time
    "publish post", // Define the job name
    { userId, postId } // Attach userId and postId as data for the job
  );
};

// Route to create and schedule a post
router.post(
  "/create",
  isSessionValid,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { text, uploadDate, platform } = req.body;
      const images = req.files.images || [];
      const videos = req.files.videos || [];

      console.log({ image: images, videso: videos });

      const imageUrls = await uploadImagesToCloudinary(images);
      const videoUrls = await uploadVideosToCloudinary(videos);

      const post = {
        text,
        platform: JSON.parse(platform),
        uploadDate,
        images: imageUrls,
        videos: videoUrls,
      };

      req.user.posts.push(post);
      const savedUser = await req.user.save();
      const newPost = savedUser.posts[savedUser.posts.length - 1];
      await schedulePost(newPost._id, req.user._id);
      console.log("post sheduled sucessfully");
      res
        .status(201)
        .json({ message: "Post created and scheduled", post: newPost });
    } catch (error) {
      console.error("Error creating post:", error);
      // Provide detailed error messages based on the scenario
      const errorMessage = error.message || "Failed to create post";
      res.status(500).json({ error: errorMessage });
    }
  }
);

// Route to get all post
router.get("/all", isSessionValid, async (req, res) => {
  try {
    console.log("getting all posts ...........");
    const posts = req.user.posts;
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scheduled posts" });
  }
});

// Route to retrieve scheduled posts
router.get("/scheduled", isSessionValid, async (req, res) => {
  try {
    console.log("getting scheduled posts ...........");
    const posts = req.user.posts.filter((post) => post.status === "scheduled");
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scheduled posts" });
  }
});

// Route to retrieve published posts
router.get("/published", isSessionValid, async (req, res) => {
  try {
    console.log("getting published posts ...........");
    const posts = req.user.posts.filter((post) => post.status === "published");
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch published posts" });
  }
});

// Route to retrieve faild posts
router.get("/failed", isSessionValid, async (req, res) => {
  try {
    console.log("getting failed posts ...........");
    const posts = req.user.posts.filter((post) => post.status === "failed");
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch published posts" });
  }
});

// Route to retrieve post by ID
router.get("/:id", isSessionValid, async (req, res) => {
  try {
    const post = req.user.posts.id(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Route to update a post
router.put(
  "/:id",
  isSessionValid,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { text, uploadDate, platform } = req.body;
      const newImages = req.files.images || [];
      const newVideos = req.files.videos || [];

      const post = req.user.posts.id(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Upload new images and videos
      const uploadedImageUrls = await uploadImagesToCloudinary(newImages);
      const uploadedVideoUrls = await uploadVideosToCloudinary(newVideos);

      // Ensure existingImages and existingVideos are arrays
      const existingImages = Array.isArray(req.body.images)
        ? req.body.images
        : [];
      const existingVideos = Array.isArray(req.body.videos)
        ? req.body.videos
        : [];

      // Check for removed images and videos
      const removedImages = post.images.filter(
        (url) => !existingImages.includes(url)
      );
      const removedVideos = post.videos.filter(
        (url) => !existingVideos.includes(url)
      );

      // Delete removed media from Cloudinary
      const removedMedia = [...removedImages, ...removedVideos];
      if (removedMedia.length > 0) {
        await deleteMedia(removedMedia);
      }

      function updateTime(uploadDate, post) {
        const currentTime = new Date();
        console.log(currentTime.toLocaleString()); // Local time as a string
        console.log(currentTime.toUTCString()); // UTC time as a string

        // Only update the time if the post status is "failed"
        if (post.status === "failed") {
          const newTime = new Date(currentTime.getTime() + 5 * 60000); // Add 5 minutes
          const formattedNewTime = newTime.toISOString().slice(0, 16); // Format to "YYYY-MM-DDTHH:MM"

          console.log(currentTime);
          if (uploadDate === post.uploadDate) {
            return formattedNewTime;
          } else {
            return uploadDate || post.uploadDate;
          }
        }

        // If the post status is not "failed", return the existing uploadDate
        return uploadDate || post.uploadDate;
      }

      // Update post fields
      post.text = text || post.text;
      post.status = "scheduled";
      post.uploadDate = updateTime(uploadDate, post); // Call the function with arguments
      post.platform = platform ? JSON.parse(platform) : post.platform;
      post.images = [...existingImages, ...uploadedImageUrls];
      post.videos = [...existingVideos, ...uploadedVideoUrls];

      await req.user.save();
      await schedulePost(post._id, req.user._id);

      res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  }
);

// Route to delete a post (scheduled or published)
router.delete("/:id", isSessionValid, async (req, res) => {
  try {
    const post = req.user.posts.id(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.images.length) {
      await deleteImagesFromCloudinary(post.images);
    }

    req.user.posts.pull(req.params.id);
    await req.user.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// Start Agenda
agenda.start();

module.exports = router;
