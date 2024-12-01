// socialPostPublishers.js
const axios = require("axios");
const User = require("../model/User");

const publishToInstagram = async (post, user) => {
  const { imageUrl, videos } = post;
  const caption = post.text;

  if (!caption || !imageUrl) {
    throw new Error("Caption and image URL are required.");
  }

  console.log("Publishing to Instagram...");

  try {
    // Fetch user details from the database
    const dbUser = await User.findById(user._id);

    console.log(dbUser);

    if (!dbUser || !dbUser.selectedInstagramBusinessPage) {
      throw new Error("User Instagram credentials not found.");
    }

    let accessToken = dbUser.selectedInstagramBusinessPage.accessToken;

    // Refresh token if expired
    if (Date.now() > new Date(dbUser.instagramTokenExpiry).getTime()) {
      console.log("Refreshing Instagram access token...");
      const response = await axios.get(
        "https://graph.instagram.com/refresh_access_token",
        {
          params: {
            grant_type: "ig_refresh_token",
            access_token: accessToken,
          },
        }
      );

      accessToken = response.data.access_token;
      dbUser.instagramAccessToken = accessToken;
      dbUser.instagramTokenExpiry = new Date(
        Date.now() + response.data.expires_in * 1000
      );
      await dbUser.save();
      console.log("Instagram access token refreshed successfully.");
    }

    // Step 1: Create media container
    const mediaContainerResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${dbUser.selectedInstagramBusinessPage.id}/media`,
      {
        image_url: imageUrl,
        caption,
        access_token: accessToken,
      }
    );

    const { id: mediaContainerId } = mediaContainerResponse.data;

    // Step 2: Publish media
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${dbUser.selectedInstagramBusinessPage.id}/media_publish`,
      {
        creation_id: mediaContainerId,
        access_token: accessToken,
      }
    );

    console.log("Post published successfully!");

    return {
      success: true,
      postId: publishResponse.data.id,
    };
  } catch (error) {
    console.error(
      "Error posting content on Instagram:",
      error.response?.data || error.message
    );
    throw new Error("Failed to post content on Instagram.");
  }
};

const publishToFacebook = async (post, user) => {
  const { images, videos } = post;
  const message = post.text;

  if (!message && (!images || images.length === 0)) {
    throw new Error("Message or at least one image URL is required.");
  }

  console.log("Publishing to Facebook...");

  try {
    // Fetch user from the database
    const dbUser = await User.findById(user._id);

    if (!dbUser || !dbUser.selectedFacebookBusinessPage) {
      throw new Error("User not found or Facebook access token is missing.");
    }

    let accessToken = dbUser.selectedFacebookBusinessPage.accessToken;

    // Check if the token is expired and refresh if necessary
    // if (Date.now() > new Date(dbUser.facebookTokenExpiry).getTime()) {
    //   console.log("Refreshing Facebook access token...");
    //   const refreshResponse = await axios.get(
    //     "https://graph.facebook.com/v17.0/oauth/access_token",
    //     {
    //       params: {
    //         grant_type: "fb_exchange_token",
    //         client_id: process.env.FACEBOOK_APP_ID,
    //         client_secret: process.env.FACEBOOK_APP_SECRET,
    //         fb_exchange_token: accessToken,
    //       },
    //     }
    //   );

    //   accessToken = refreshResponse.data.access_token;
    //   dbUser.selectedFacebookBusinessPage.accessToken = accessToken;
    //   // dbUser.facebookTokenExpiry = new Date(
    //   //   Date.now() + refreshResponse.data.expires_in * 1000
    //   // );
    //   await dbUser.save();
    // }

    // Create and publish the post
    const postResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${dbUser.selectedFacebookBusinessPage.id}/feed`,
      {
        access_token: accessToken,
        message,
      }
    );

    console.log("Post published successfully on Facebook!");
    const postId = postResponse.data.id;

    // Handle image uploads
    if (images && images.length > 0) {
      await Promise.all(
        images.map((imageUrl) =>
          axios.post(`https://graph.facebook.com/v17.0/${postId}/photos`, {
            access_token: accessToken,
            url: imageUrl,
            published: true,
          })
        )
      );
    }

    return {
      success: true,
      postId,
    };
  } catch (error) {
    console.error(
      "Error posting content on Facebook:",
      error.response?.data || error.message
    );
    throw new Error("Failed to post content on Facebook.");
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
