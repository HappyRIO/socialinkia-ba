import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveSidebar from "../../../components/navigation/ResponsiveSidebar";
import { toast, ToastContainer } from "react-toastify";

export default function PostCreation() {
  const [postText, setPostText] = useState("");
  const [aitext, setAitext] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [platform, setplatform] = useState({
    all: true,
    google: false,
    insta: false,
    fbook: false,
  });

  const reroute = useNavigate();

  const handleChange = (event) => {
    const selectedValue = event.target.value;

    // Update the state based on the selected value
    setplatform((prevState) => {
      // Start with the previous state to avoid overwriting other properties
      const updatedState = { ...prevState };

      if (selectedValue === "fbook") {
        updatedState.fbook = true;
        updatedState.insta = false;
        updatedState.google = false;
        updatedState.both = false;
      } else if (selectedValue === "insta") {
        updatedState.fbook = false;
        updatedState.google = false;
        updatedState.insta = true;
        updatedState.both = false;
      } else if (selectedValue === "google") {
        updatedState.google = true;
        updatedState.fbook = false;
        updatedState.insta = false;
        updatedState.both = false;
      } else {
        updatedState.fbook = false;
        updatedState.insta = false;
        updatedState.google = false;
        updatedState.both = true;
      }

      return updatedState;
    });
  };

  const [uploaddata, setUploaddata] = useState({
    date: "", // initial state for the upload date
  });
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // This takes the user back to the previous page
  };

  // Handle text input change for the main post text
  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  // Handle text input change for AI-generated text
  const handleAiTextChange = (e) => {
    setAitext(e.target.value);
  };

  // Handle file selection for images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);

    // Generate file preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews([...filePreviews, ...previews]);
  };

  // Handle change for the upload date
  const handleDateChange = (e) => {
    const newDate = e.target.value; // Get the new date value from the event
    setUploaddata({ date: newDate });
  };

  useEffect(() => {
    console.log({ date: uploaddata.date });
  }, [uploaddata.date]); // This will run whenever uploaddata.date changes

  // Handle image removal
  const handleImageRemove = (index) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
    const newFilePreviews = filePreviews.filter((_, i) => i !== index);
    setSelectedFiles(newSelectedFiles);
    setFilePreviews(newFilePreviews);
  };

  // Handle form submission to post data to the backend
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("text", postText);
    formData.append("platform", JSON.stringify(platform)); // Stringify platform object
    formData.append("uploadDate", uploaddata.date); // Add the upload date to the form data
    selectedFiles.forEach((file) => {
      formData.append("images", file); // Append images as an array of files
    });

    // Example API call to create the post
    fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/posts/create`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Post created successfully") {
          toast(`Post created successfully!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          console.log("Post created successfully:", data);
          reroute("/dashboard/posts");
        }
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <ToastContainer
        position="top-left"
        autoClose={3000} // Optional: auto close after 3 seconds
        hideProgressBar={false} // Optional: show progress bar
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
      <div className="navzone w-fit">
        <ResponsiveSidebar pagename={"Create Post"} />
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
              <div className="releasedate max-w-[350px] flex flex-col justify-center items-center">
                <label htmlFor="date">Upload date</label>
                <input
                  className="bg-background p-2 rounded-lg w-full text-text"
                  type="datetime-local"
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
                >
                  <option className="text-text" value="all">
                    All
                  </option>
                  <option className="text-text" value="google">
                    google
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
            {/* Display image previews here */}
            {filePreviews.length > 0 &&
              filePreviews.map((preview, index) => (
                <div key={index} className="relative w-full mb-2 sm:mb-4">
                  <img
                    className="w-full object-cover rounded-lg"
                    src={preview}
                    alt="Image Preview"
                  />
                  {/* Delete icon */}
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
                <span className="text-text font-medium">Upload files</span>
              </label>
              <input
                id="upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
            </div>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            onClick={handleSubmit}
          >
            Submit Post
          </button>
        </div>
      </div>
    </div>
  );
}
