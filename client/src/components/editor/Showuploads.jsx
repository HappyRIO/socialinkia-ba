import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
function Showuploads({ onClick }) {
  const [uploads, setUploads] = useState([]);
  const [loadingUrl, setLoadingUrl] = useState("");

  useEffect(() => {
    const fake = [
      {
        id: 1,
        image: "https://placehold.co/600x400?text=Sample%20Editor%201.png",
      },
      {
        id: 2,
        image: "https://placehold.co/600x400?text=Sample%20Editor%202.png",
      },
      {
        id: 3,
        image: "https://placehold.co/600x400?text=Sample%20Editor%203.png",
      },
      {
        id: 4,
        image: "https://placehold.co/600x400?text=Sample%20Editor%204.png",
      },
      {
        id: 5,
        image: "https://placehold.co/600x400?text=Sample%20Editor%205.png",
      },
      {
        id: 6,
        image: "https://placehold.co/600x400?text=Sample%20Editor%206.png",
      },
      {
        id: 7,
        image: "https://placehold.co/600x400?text=Sample%20Editor%207.png",
      },
      {
        id: 8,
        image: "https://placehold.co/600x400?text=Sample%20Editor%208.png",
      },
      {
        id: 9,
        image: "https://placehold.co/600x400?text=Sample%20Editor%209.png",
      },
      {
        id: 10,
        image: "https://placehold.co/600x400?text=Sample%20Editor%2010.png",
      },
    ];
    setUploads(fake); // Set the "fake" data as uploads
  }, []);

  // Function to handle loading image from URL on Enter key press
  const handleUrlInput = (e) => {
    if (e.key === "Enter" && loadingUrl) {
      onClick(loadingUrl); // Trigger the image insertion function with URL
      setLoadingUrl(""); // Reset the input field
    }
  };

  return (
    <div className="w-full flex flex-col justify-end items-center">
      <div className="title">
        <h1>Uploads</h1>
      </div>
      <div className="loadfromurl">
        <input
          id="loadfromurl"
          type="text"
          value={loadingUrl}
          onChange={(e) => setLoadingUrl(e.target.value)}
          onKeyDown={handleUrlInput}
          placeholder="Enter image URL and press Enter"
        />
      </div>
      <div className="w-full grid grid-cols-3">
        {uploads.map((file) => (
          <img
            className="rounded-lg overflow-hidden"
            key={file.id}
            onClick={() => onClick(file.image)} // Pass image URL to handleAddImage
            src={file.image}
            alt={`Upload ${file.id}`}
            width="100"
            height="100"
          />
        ))}
      </div>
    </div>
  );
}

export default Showuploads;
