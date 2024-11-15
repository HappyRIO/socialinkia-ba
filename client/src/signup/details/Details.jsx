import { useState } from "react";

export default function CompaniesDetails() {
  const [formData, setFormData] = useState({
    name: "",
    companyCreationDate: "",
    slogan: "",
    numEmployees: "",
    contactInfo: "",
    businessPurpose: "",
    photos: null,
    preferredLanguage: "en",
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [photoPreviews, setPhotoPreviews] = useState([]); // For photo preview

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setFormData({ ...formData, photos: files });

    // Preview selected images
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (
      !formData.name ||
      !formData.companyCreationDate ||
      !formData.slogan ||
      !formData.numEmployees ||
      !formData.contactInfo ||
      !formData.businessPurpose
    ) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if (key === "photos" && formData.photos) {
        Array.from(formData.photos).forEach((file) =>
          data.append("photos", file)
        );
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/user/details`,
        {
          method: "PUT",
          body: data,
          credentials: "include", // This sends the session token along with the request
        }
      );

      if (response.ok) {
        console.log("Details uploaded successfully");
        window.location.href = "/login"; // Redirect after successful upload
      } else {
        console.error("Upload failed:", response.statusText);
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {loading && <div className="spinner">Loading...</div>}{" "}
      {/* Loading spinner */}
      <form onSubmit={handleSubmit} className="form space-y-4 p-4">
        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="text"
          id="name"
          placeholder="Company Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="date"
          id="companyCreationDate"
          placeholder="Company Creation Date"
          value={formData.companyCreationDate}
          onChange={handleChange}
          required
        />

        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="text"
          id="slogan"
          placeholder="Company Slogan"
          value={formData.slogan}
          onChange={handleChange}
          required
        />

        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="number"
          id="numEmployees"
          placeholder="Number of Employees"
          value={formData.numEmployees}
          onChange={handleChange}
          required
        />

        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="text"
          id="contactInfo"
          placeholder="Contact Information (Phone or Email)"
          value={formData.contactInfo}
          onChange={handleChange}
          required
        />

        <textarea
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          id="businessPurpose"
          placeholder="Business Purpose"
          value={formData.businessPurpose}
          onChange={handleChange}
          required
        />

        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="file"
          id="photos"
          multiple
          onChange={handleFileChange}
        />

        {/* Display selected images */}
        {photoPreviews.length > 0 && (
          <div className="photo-previews">
            {photoPreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-24 h-24 object-cover my-2"
              />
            ))}
          </div>
        )}

        <select
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          id="preferredLanguage"
          value={formData.preferredLanguage}
          onChange={handleChange}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600"
        >
          Submit Details
        </button>
      </form>
    </div>
  );
}
