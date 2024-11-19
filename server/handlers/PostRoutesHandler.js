// socialPostPublishers.js
const axios = require("axios");

const publishToInstagram = async (post, user) => {
  const { imageUrl, videos } = post;
  const caption = post.text;
  console.log("publishing to instagram......");
  const accessToken = user.instagramAccessToken;

  if (!caption || !imageUrl) {
    throw new Error("Caption and image URL are required.");
  }

  try {
    // Step 1: Create media container
    const mediaContainerResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.INSTAGRAM_USER_ID}/media`,
      {
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken,
      }
    );

    const { id: mediaContainerId } = mediaContainerResponse.data;

    // Step 2: Publish media
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.INSTAGRAM_USER_ID}/media_publish`,
      {
        creation_id: mediaContainerId,
        access_token: accessToken,
      }
    );

    return {
      success: true,
      postId: publishResponse.data.id,
    };
  } catch (error) {
    console.error("Error posting content on Instagram:", error.message);
    throw new Error("Failed to post content on Instagram.");
  }
};

const publishToFacebook = async (post, user) => {
  const { images, videos } = post;
  const message = post.text;
  console.log("publishing to facebook......");

  const accessToken = user.facebookAccessToken;

  if (!message && (!images || images.length === 0)) {
    throw new Error("Message or at least one image URL is required.");
  }

  try {
    // Publish message to Facebook
    const postResponse = await axios.post(
      `https://graph.facebook.com/v17.0/me/feed`,
      {
        access_token: accessToken,
        message,
      }
    );

    const postId = postResponse.data.id;

    if (images && images.length > 0) {
      const imageUploadPromises = images.map((imageUrl) =>
        axios.post(`https://graph.facebook.com/v17.0/${postId}/photos`, {
          access_token: accessToken,
          url: imageUrl,
          published: false,
        })
      );

      await Promise.all(imageUploadPromises);
    }

    return {
      success: true,
      postId,
    };
  } catch (error) {
    console.error("Error posting content on Facebook:", error.message);
    throw new Error("Failed to post content on Facebook.");
  }
};

const publishToGmb = async (post, user) => {
  const { imageUrl, videos } = post;
  const message = post.text;
  console.log("publishing to google......");
  const accessToken = user.gmbAccessToken;

  if (!message || !imageUrl) {
    throw new Error("Message and image URL are required.");
  }

  try {
    // Step 1: Upload media
    const mediaResponse = await axios.post(
      `https://mybusiness.googleapis.com/v4/accounts/${process.env.GMB_ACCOUNT_ID}/locations/${process.env.GMB_LOCATION_ID}/media`,
      {
        media: {
          sourceUrl: imageUrl,
          mimeType: "image/jpeg", // adjust MIME type based on your image format
        },
        access_token: accessToken,
      }
    );

    // Step 2: Create post
    const createPostResponse = await axios.post(
      `https://mybusiness.googleapis.com/v4/accounts/${process.env.GMB_ACCOUNT_ID}/locations/${process.env.GMB_LOCATION_ID}/localPosts`,
      {
        summary: message,
        media: [mediaResponse.data],
        access_token: accessToken,
      }
    );

    return {
      success: true,
      postId: createPostResponse.data.name,
    };
  } catch (error) {
    console.error(
      "Error posting content on Google My Business:",
      error.message
    );
    throw new Error("Failed to post content on Google My Business.");
  }
};

module.exports = { publishToInstagram, publishToFacebook, publishToGmb };
