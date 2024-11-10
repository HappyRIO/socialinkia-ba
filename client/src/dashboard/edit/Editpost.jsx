import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";

export default function Editpost() {
  const [postdata, setPostdata] = useState([]);
  const [postText, setPostText] = useState("");
  const [aitext, setAitext] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  // Inside your component function
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // This takes the user back to the previous page
  };

  const imageList = [
    "https://placehold.co/600x400/000000/FFFFFF/png",
    "https://placehold.co/600x800/000000/FFFFFF/png",
    "https://placehold.co/600x400/000000/FFFFFF/png",
    "https://placehold.co/600x400/000000/FFFFFF/png",
    "https://placehold.co/600x700/000000/FFFFFF/png",
  ];

  useEffect(() => {
    setPostdata(imageList);
  }, []);

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleAiTextChange = (e) => {
    setAitext(e.target.value);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Generate file preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("text", postText);
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Example API call to update the post
    fetch("/api/edit-post", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post updated successfully:", data);
        // handle response here (maybe redirect, show success message)
      })
      .catch((error) => {
        console.error("Error updating post:", error);
      });
  };

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navzone w-fit">
        <ResponsiveSidebar pagename={"Edit post"} />
      </div>
      <div className="contentzone pt-3 px-2 ml-0 sm:ml-64 w-full flex flex-col gap-3 justify-center items-center">
        <div className="mininav w-full">
          <button
            onClick={handleBackClick}
            className="px-2 w-full bg-accent rounded-lg"
          >
            back
          </button>
        </div>
        <div className="editorpage p-2 bg-background2 rounded-lg w-full flex flex-col gap-2 justify-center items-center">
          <div className="postId">
            <p>3456789021e2321</p>
          </div>
          <div className="releasedate w-full sm:w-1/2 flex flex-col justify-center items-center">
            <label htmlFor="date">release date</label>
            <input
              className="bg-background p-2 rounded-lg w-full text-text"
              type="date"
              name="date"
              id="date"
            />
          </div>
          <div className="postText w-full flex flex-col gap-2">
            <input
              onChange={handleAiTextChange}
              className="rounded-lg p-2 w-full"
              type="text"
              value={aitext}
              placeholder="promt ai assistant ...."
            />
            <textarea
              className="w-full rounded-lg focus:border-accent p-2"
              name="postText"
              id="postText"
              placeholder="write your post.........."
              rows="10"
              value={postText}
              onChange={handleTextChange}
            />
          </div>
          <div className="postImages columns-2 gap-2 sm:gap-4">
            {postdata.map((data, index) => (
              <div key={index} className="w-full mb-2 sm:mb-4">
                <img
                  className="w-full object-cover rounded-lg"
                  src={data}
                  alt=""
                />
              </div>
            ))}
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
                <span className="text-text font-medium">Upload file</span>
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
          {filePreviews.length > 0 && (
            <div className="file-previews columns-2 gap-2 sm:gap-4">
              {filePreviews.map((preview, index) => (
                <div key={index} className="w-full mb-2 sm:mb-4">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
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
