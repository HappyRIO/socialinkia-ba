// CreateTemplate
import { useState } from "react";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import { toast, ToastContainer } from "react-toastify";

export default function PostCreation() {
  const [postText, setPostText] = useState("");
  const [aitext, setAitext] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [platform, setPlatform] = useState({
    all: true,
    gmb: true,
    insta: true,
    fbook: true,
  });

  const [uploaddata, setUploaddata] = useState({
    date: "",
  });

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setPlatform((prevState) => {
      const updatedState = { ...prevState };

      if (selectedValue === "fbook") {
        updatedState.fbook = true;
        updatedState.insta = false;
        updatedState.gmb = false;
        updatedState.all = false;
      } else if (selectedValue === "insta") {
        updatedState.fbook = false;
        updatedState.insta = true;
        updatedState.gmb = false;
        updatedState.all = false;
      } else if (selectedValue === "gmb") {
        updatedState.gmb = true;
        updatedState.fbook = false;
        updatedState.insta = false;
        updatedState.all = false;
      } else {
        updatedState.fbook = true;
        updatedState.insta = true;
        updatedState.gmb = true;
        updatedState.all = true;
      }

      return updatedState;
    });
  };

  const handleTextChange = (e) => setPostText(e.target.value);
  const handleAiTextChange = (e) => setAitext(e.target.value);
  const handleDateChange = (e) => setUploaddata({ date: e.target.value });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));

    setSelectedFiles((prev) => [...prev, ...files]);
    setFilePreviews((prev) => [...prev, ...previews]);
  };

  const handleImageRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("text", postText);
    formData.append("platform", JSON.stringify(platform));
    formData.append("uploadDate", uploaddata.date);

    selectedFiles.forEach((file) => {
      formData.append(
        file.type.startsWith("video") ? "videos" : "images",
        file
      );
    });
    fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/posts/create`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then(async (response) => {
        // Parse JSON and handle non-OK status codes
        const data = await response.json();

        if (!response.ok) {
          // Handle different HTTP error statuses
          const errorMessage =
            data.error || `Error ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        }

        // Check if the message confirms success
        if (data.message === "Post created and scheduled") {
          // alert("posted");
          window.location.href = "/dashboard/posts";
          // toast.success("Post created successfully!", { theme: "dark" });
          setPostText("");
          setSelectedFiles([]);
          setFilePreviews([]);
          setUploaddata({ date: "" });
        } else {
          throw new Error(data.error || "Unexpected response from server.");
        }
      })
      .catch((error) => {
        // Show error message in toast and log for debugging
        // toast.error(`Failed to create post: ${error.message}`, {
        //   theme: "dark",
        // });
        console.error("Error creating post:", error);
      });
  };

  function handleGeneratePost() {
    const response = fetch(
      `${
        import.meta.env.VITE_SERVER_BASE_URL
      }/api/gpt/generate-posts?aitext=${aitext}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = response.json();

    console.log(data);
  }

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <ToastContainer position="top-left" autoClose={3000} pauseOnFocusLoss />
      <div className="navzone w-fit">
        <ResponsiveSidebar pagename={"Create Post"} />
      </div>
      <div className="contentzone pt-3 px-2 ml-0 sm:ml-64 w-full flex flex-col gap-3 justify-center items-center">
        <div className="editorpage p-2 bg-background2 rounded-lg w-full flex flex-col gap-2">
          <div className="w-full flex flex-col md:flex-row gap-2 justify-center items-center">
            <div className="w-full flex flex-col gap-1 justify-center items-center">
              <label>Upload date</label>
              <input
                type="datetime-local"
                value={uploaddata.date}
                onChange={handleDateChange}
                className="bg-background p-2 rounded-lg w-full"
              />
            </div>
            <div className="w-full flex flex-col gap-1 justify-center items-center">
              <label>Select platform</label>
              <select
                onChange={handleChange}
                className="rounded-lg p-2 text-center"
              >
                <option value="all">All</option>
                <option value="gmb">Google</option>
                <option value="fbook">Facebook</option>
                <option value="insta">Instagram</option>
              </select>
            </div>
          </div>
          <div className="postText w-full flex flex-col gap-2">
            <div className="promt-ai flex flex-col md:flex-row gap-2">
              <div className="w-full">
                <input
                  onChange={handleAiTextChange}
                  className="rounded-lg p-2 w-full"
                  type="text"
                  value={aitext}
                  placeholder="Prompt AI assistant ( optional )..."
                />
              </div>
              <div className="promt-space">
                <button
                  onClick={handleGeneratePost}
                  className="p-2 bg-accent rounded-lg"
                >
                  generate
                </button>
              </div>
            </div>
            <textarea
              className="w-full rounded-lg focus:border-accent p-2"
              name="postText"
              id="postText"
              placeholder="you can generate post or Write your post..."
              rows="7"
              value={postText}
              onChange={handleTextChange}
            />
          </div>
          <div className="postImages columns-2 lg:columns-3 gap-2 sm:gap-4">
            {filePreviews.map(({ preview, type }, index) => (
              <div key={index} className="relative py-2">
                {type === "image" ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="w-full object-cover rounded-lg"
                  />
                )}
                <button
                  className="absolute top-1 right-1 text-red-500 font-bold"
                  onClick={() => handleImageRemove(index)}
                >
                  ✕
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
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Submit Post
          </button>
        </div>
      </div>
    </div>
  );
}
