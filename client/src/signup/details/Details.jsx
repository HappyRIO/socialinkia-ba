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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photos: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to handle text and file fields
    const data = new FormData();
    for (const key in formData) {
      if (key === "photos") {
        Array.from(formData.photos).forEach((file) =>
          data.append("photos", file)
        );
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/details`,
        {
          method: "PUT",
          body: data,
        }
      );

      if (response.ok) {
        window.location.href = "/login";
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="form space-y-4 p-4">
        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="text"
          id="name"
          placeholder="Company Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="date"
          id="companyCreationDate"
          placeholder="Company Creation Date"
          value={formData.companyCreationDate}
          onChange={handleChange}
        />

        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="text"
          id="slogan"
          placeholder="Company Slogan"
          value={formData.slogan}
          onChange={handleChange}
        />

        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="number"
          id="numEmployees"
          placeholder="Number of Employees"
          value={formData.numEmployees}
          onChange={handleChange}
        />

        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="text"
          id="contactInfo"
          placeholder="Contact Information (Phone or Email)"
          value={formData.contactInfo}
          onChange={handleChange}
        />

        <textarea
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          id="businessPurpose"
          placeholder="Business Purpose"
          value={formData.businessPurpose}
          onChange={handleChange}
        />

        <input
          className="px-2 py-2 w-full rounded-lg border-red-500 focus:border-blue-500"
          type="file"
          id="photos"
          multiple
          onChange={handleFileChange}
        />

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
          Submit details
        </button>
      </form>
    </div>
  );
}
