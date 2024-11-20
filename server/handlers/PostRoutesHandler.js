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

const publishToGmb = async (post, user, locationId) => {
  const { imageUrl, text: summary, callToActionUrl } = post;
  const accessToken = user.gmbAccessToken;

  console.log("Publishing to Google My Business...");

  if (!summary || !imageUrl) {
    throw new Error("Message (summary) and image URL are required.");
  }

  try {
    // Step 1: Upload media
    console.log("Uploading media...");
    const mediaPayload = {
      mediaFormat: "PHOTO",
      sourceUrl: imageUrl,
    };

    const mediaResponse = await axios.post(
      `https://mybusiness.googleapis.com/v4/accounts/${process.env.GMB_ACCOUNT_ID}/locations/${locationId}/media`,
      mediaPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const uploadedMedia = mediaResponse.data;
    console.log("Media uploaded successfully:", uploadedMedia);

    // Step 2: Create the post
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
      `https://mybusiness.googleapis.com/v4/accounts/${process.env.GMB_ACCOUNT_ID}/locations/${locationId}/localPosts`,
      postPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
