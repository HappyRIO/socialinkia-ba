// Editpost
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";

export default function Editpost() {
  const { postId } = useParams(); // Assuming postId is in the URL parameters
  const [postText, setPostText] = useState("");
  const [aitext, setAitext] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [platform, setplatform] = useState({
    both: false,
    insta: false,
    fbook: false,
  });
  const [uploaddata, setUploaddata] = useState({
    date: "", // initial state for the upload date
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch post details for editing
    fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/posts/${postId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.post) {
          const { text, platform, uploaddate, images } = data.post;
          setPostText(text);
          setplatform(platform);
          setUploaddata({ date: uploaddate });

          // Set file previews if there are images
          setFilePreviews(images || []);
        } else {
          toast.error("Failed to load post details");
        }
      })
      .catch((error) => {
        console.error("Error fetching post details:", error);
        toast.error("Error fetching post details");
      });
  }, [postId]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;

    setplatform((prevState) => {
      const updatedState = { ...prevState };

      if (selectedValue === "fbook") {
        updatedState.fbook = true;
        updatedState.insta = false;
        updatedState.both = false;
      } else if (selectedValue === "insta") {
        updatedState.fbook = false;
        updatedState.insta = true;
        updatedState.both = false;
      } else {
        updatedState.fbook = false;
        updatedState.insta = false;
        updatedState.both = true;
      }

      return updatedState;
    });
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleAiTextChange = (e) => {
    setAitext(e.target.value);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);

    // Generate file preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews([...filePreviews, ...previews]);
  };

  const handleDateChange = (e) => {
    setUploaddata({ ...uploaddata, date: e.target.value });
  };

  const handleImageRemove = (index) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
    const newFilePreviews = filePreviews.filter((_, i) => i !== index);
    setSelectedFiles(newSelectedFiles);
    setFilePreviews(newFilePreviews);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("text", postText);
    formData.append("platform", JSON.stringify(platform)); // Stringify platform object
    formData.append("uploadDate", uploaddata.date); // Add the upload date to the form data
    selectedFiles.forEach((file) => {
      formData.append("images", file); // Append images as an array of files
    });

    // Example API call to update the post
    fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/posts/${postId}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Post updated successfully") {
          toast.success("Post updated successfully!");
          navigate("/dashboard/pending");
        } else {
          toast.error("Failed to update post");
        }
      })
      .catch((error) => {
        console.error("Error updating post:", error);
        toast.error("Error updating post");
      });
  };

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <div className="navzone w-fit">
        <ResponsiveSidebar pagename={"Edit Post"} />
      </div>
      <div className="contentzone pt-3 px-2 ml-0 sm:ml-64 w-full flex flex-col gap-3 justify-center items-center">
        <div className="mininav w-full">
          <button
            onClick={handleBackClick}
            className="px-2 py-2 w-full bg-accent rounded-lg"
          >
            Back
          </button>
        </div>
        <div className="editorpage p-2 bg-background2 rounded-lg w-full flex flex-col gap-2 justify-center items-center">
          <div className="w-full flex flex-col gap-2 sm:flex-row">
            <div className="w-full flex justify-center items-center">
              <div className="releasedate max-w-[150px] flex flex-col justify-center items-center">
                <label htmlFor="date">Upload date</label>
                <input
                  className="bg-background p-2 rounded-lg w-full text-text"
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={uploaddata.date}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <div className="w-full flex justify-center items-center">
              <div className="selectionZone flex flex-col gap-2">
                <label htmlFor="socialSelect" className="text-xl">
                  Select platform
                </label>
                <select
                  id="socialSelect"
                  className="rounded-lg p-2 text-center text-accent"
                  onChange={handleChange}
                  value={
                    platform.both
                      ? "all"
                      : platform.insta
                      ? "insta"
                      : platform.fbook
                      ? "fbook"
                      : "all"
                  }
                >
                  <option className="text-text" value="all">
                    All
                  </option>
                  <option className="text-text" value="fbook">
                    Facebook
                  </option>
                  <option className="text-text" value="insta">
                    Instagram
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="postText w-full flex flex-col gap-2">
            <input
              onChange={handleAiTextChange}
              className="rounded-lg p-2 w-full"
              type="text"
              value={aitext}
              placeholder="Prompt AI assistant ..."
            />
            <textarea
              className="w-full rounded-lg focus:border-accent p-2"
              name="postText"
              id="postText"
              placeholder="Write your post..."
              rows="10"
              value={postText}
              onChange={handleTextChange}
            />
          </div>
          <div className="postImages columns-2 gap-2 sm:gap-4">
            {filePreviews.length > 0 &&
              filePreviews.map((preview, index) => (
                <div key={index} className="relative w-full mb-2 sm:mb-4">
                  <img
                    className="w-full object-cover rounded-lg"
                    src={preview}
                    alt="Image Preview"
                  />
                  <button
                    className="absolute top-1 right-1 text-red-500 font-bold"
                    onClick={() => handleImageRemove(index)}
                  >
                    D
                  </button>
                </div>
              ))}
          </div>
          <div className="w-full">
            <div className="rounded-md w-full border border-accent p-4 shadow-md">
              <label
                htmlFor="upload"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 fill-white stroke-accent"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-center text-accent">Upload an image</span>
                <input
                  type="file"
                  name="images"
                  id="upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
              </label>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-accent text-white px-6 py-2 rounded-md w-full sm:w-1/3 mt-4"
          >
            Save Post
          </button>
        </div>
      </div>
    </div>
  );
}
