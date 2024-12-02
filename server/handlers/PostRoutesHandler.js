// socialPostPublishers.js
const axios = require("axios");
const User = require("../model/User");

const publishToInstagram = async (post, user) => {
  const { imageUrls, videoUrls } = post; // Arrays of images and videos
  const caption = post.text;

  if (!caption || (!imageUrls && !videoUrls)) {
    throw new Error("Caption, image URLs, or video URLs are required.");
  }

  console.log("Publishing to Instagram...");

  try {
    // Fetch user details from the database
    const dbUser = await User.findById(user._id);

    if (!dbUser || !dbUser.selectedInstagramBusinessPage) {
      throw new Error("User Instagram credentials not found.");
    }

    const { id: instagramBusinessId, accessToken } =
      dbUser.selectedInstagramBusinessPage;

    const postResults = []; // Store results of each post

    // Publish videos
    if (videoUrls && videoUrls.length > 0) {
      for (const videoUrl of videoUrls) {
        console.log(`Uploading video: ${videoUrl}`);
        const videoResponse = await axios.post(
          `https://graph.facebook.com/v17.0/${instagramBusinessId}/media`,
          {
            video_url: videoUrl,
            caption,
            access_token: accessToken,
          }
        );

        const { id: mediaContainerId } = videoResponse.data;
        console.log("Video container created:", mediaContainerId);

        // Publish video
        const publishResponse = await axios.post(
          `https://graph.facebook.com/v17.0/${instagramBusinessId}/media_publish`,
          {
            creation_id: mediaContainerId,
            access_token: accessToken,
          }
        );

        console.log("Video published successfully:", publishResponse.data);
        postResults.push({
          type: "video",
          postId: publishResponse.data.id,
        });
      }
    }

    // Publish images
    if (imageUrls && imageUrls.length > 0) {
      for (const imageUrl of imageUrls) {
        console.log(`Uploading image: ${imageUrl}`);
        const imageResponse = await axios.post(
          `https://graph.facebook.com/v17.0/${instagramBusinessId}/media`,
          {
            image_url: imageUrl,
            caption,
            access_token: accessToken,
          }
        );

        const { id: mediaContainerId } = imageResponse.data;
        console.log("Image container created:", mediaContainerId);

        // Publish image
        const publishResponse = await axios.post(
          `https://graph.facebook.com/v17.0/${instagramBusinessId}/media_publish`,
          {
            creation_id: mediaContainerId,
            access_token: accessToken,
          }
        );

        console.log("Image published successfully:", publishResponse.data);
        postResults.push({
          type: "image",
          postId: publishResponse.data.id,
        });
      }
    }

    console.log("All media published successfully:", postResults);

    return {
      success: true,
      results: postResults,
    };
  } catch (error) {
    console.error(
      "Error posting content on Instagram:",
      error.response?.data || error.message
    );
    throw new Error("Failed to post content on Instagram.");
  }
};

// facebook posting route
const publishToFacebook = async (post, user) => {
  const { images, videos } = post;
  const message = post.text;

  if (
    !message &&
    (!images || images.length === 0) &&
    (!videos || videos.length === 0)
  ) {
    throw new Error("Message, image URL, or video URL is required.");
  }

  console.log("Publishing to Facebook...");

  try {
    // Fetch user from the database
    const dbUser = await User.findById(user._id);

    if (!dbUser || !dbUser.selectedFacebookBusinessPage) {
      throw new Error("User not found or Facebook access token is missing.");
    }

    const { id: pageId, accessToken } = dbUser.selectedFacebookBusinessPage;

    if (!pageId || !accessToken) {
      throw new Error("Facebook Business Page credentials are incomplete.");
    }

    let postId;

    if (images && images.length > 0) {
      console.log("Creating a post with images...");

      // Step 1: Create media containers for all images
      const mediaContainers = await Promise.all(
        images.map(async (imageUrl) => {
          const response = await axios.post(
            `https://graph.facebook.com/v17.0/${pageId}/photos`,
            {
              access_token: accessToken,
              url: imageUrl,
              caption: message, // Optional for each image
              published: false, // Media container should not be published directly
            }
          );
          return response.data.id; // Media container ID
        })
      );

      console.log("Media containers created:", mediaContainers);

      // Step 2: Publish the post with the media container IDs
      const postResponse = await axios.post(
        `https://graph.facebook.com/v17.0/${pageId}/feed`,
        {
          access_token: accessToken,
          message,
          attached_media: mediaContainers.map((id) => ({ media_fbid: id })),
        }
      );

      postId = postResponse.data.id;
    } else if (videos && videos.length > 0) {
      console.log("Creating a post with a video...");

      // Step 1: Create a media container for the video
      const videoResponse = await axios.post(
        `https://graph.facebook.com/v17.0/${pageId}/videos`,
        {
          access_token: accessToken,
          file_url: videos[0], // Facebook only supports one video per post
          description: message,
        }
      );

      console.log("Video uploaded:", videoResponse.data);

      postId = videoResponse.data.id;
    } else {
      console.log("Creating a text-only post...");

      // Text-only post
      const postResponse = await axios.post(
        `https://graph.facebook.com/v17.0/${pageId}/feed`,
        {
          access_token: accessToken,
          message,
        }
      );

      postId = postResponse.data.id;
    }

    console.log("Post published successfully on Facebook!");
    return {
      success: true,
      postId,
    };
  } catch (error) {
    console.error(
      "Error posting content on Facebook:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error?.message ||
        "Failed to post content on Facebook."
    );
  }
};

const publishToGmb = async (post, user) => {
  const { imageUrl, text, callToActionUrl } = post;
  const summary = text;

  if (!user) {
    res.status(303).json({ data: "user not found" });
  }

  if (!user.selectedGoogleBusinessPage) {
    throw new Error("No Google Business location selected for the user.");
  }

  const { id: locationId, accessToken } = user.selectedGoogleBusinessPage;

  console.log("Publishing to Google My Business...");

  if (!summary || !imageUrl) {
    throw new Error("Message (summary) and image URL are required.");
  }

  try {
    // Step 1: Refresh access token if needed
    let validAccessToken = accessToken;
    if (!validAccessToken) {
      console.log("Refreshing access token...");
      const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        null,
        {
          params: {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: user.gmbRefreshToken,
            grant_type: "refresh_token",
          },
        }
      );
      validAccessToken = tokenResponse.data.access_token;

      // Optionally save the new token to the user's selected location
      user.selectedGoogleBusinessPage.accessToken = validAccessToken;
      await user.save();
    }

    // Step 2: Upload media
    console.log("Uploading media...");
    const mediaPayload = {
      mediaFormat: "PHOTO",
      sourceUrl: imageUrl,
    };

    const mediaResponse = await axios.post(
      `https://mybusiness.googleapis.com/v4/${locationId}/media`,
      mediaPayload,
      {
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const uploadedMedia = mediaResponse.data;
    console.log("Media uploaded successfully:", uploadedMedia);

    // Step 3: Create the post
    console.log("Creating post...");
    const postPayload = {
      summary,
      media: [uploadedMedia],
      callToAction: {
        actionType: "LEARN_MORE", // Adjust as needed for other actions
        url: callToActionUrl,
      },
    };

    const postResponse = await axios.post(
      `https://mybusiness.googleapis.com/v4/${locationId}/localPosts`,
      postPayload,
      {
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const createdPost = postResponse.data;
    console.log("Post created successfully:", createdPost);

    return {
      success: true,
      postId: createdPost.name,
    };
  } catch (error) {
    console.error(
      "Error posting content to Google My Business:",
      error.response?.data || error.message
    );

    throw new Error(
      `Failed to publish post: ${
        error.response?.data?.error?.message || error.message
      }`
    );
  }
};

module.exports = { publishToInstagram, publishToFacebook, publishToGmb };
