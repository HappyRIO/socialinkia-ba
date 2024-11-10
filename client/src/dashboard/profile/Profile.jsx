import { useState, useEffect } from "react";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import { toast, ToastContainer } from "react-toastify";

export default function Profile() {
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
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/user/details`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        const companyDetails = data.user.companyDetails || {};
        setFormData({
          name: companyDetails.name || "",
          companyCreationDate: companyDetails.companyCreationDate || "",
          slogan: companyDetails.slogan || "",
          numEmployees: companyDetails.numEmployees || "",
          contactInfo: companyDetails.contactInfo || "",
          businessPurpose: companyDetails.businessPurpose || "",
          preferredLanguage: companyDetails.preferredLanguage || "en",
        });
        if (companyDetails.photos) {
          setPhotoPreviews(companyDetails.photos);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
    fetchUserInfo();
  }, []);

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
          credentials: "include",
        }
      );

      if (response.ok) {
        toast(`profile updated succesfully`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        console.error("Update failed:", response.statusText);
        alert("Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <ToastContainer
        position="top-left"
        autoClose={3000} // Optional: auto close after 5 seconds
        hideProgressBar={false} // Optional: show progress bar
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
      <div className="navsystembar w-fit">
        <ResponsiveSidebar pagename={"Profile"} />
      </div>
      <div className="w-full ml-0 sm:ml-64 px-2 flex flex-col justify-center items-center">
        {loading && <div className="spinner">Loading...</div>}
        <form onSubmit={handleSubmit} className="form space-y-4 p-4">
          <input
            className="px-2 py-2 w-full rounded-lg focus:border-accent"
            type="text"
            id="name"
            placeholder="Company Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            className="px-2 py-2 w-full rounded-lg focus:border-accent"
            type="date"
            id="companyCreationDate"
            placeholder="Company Creation Date"
            value={formData.companyCreationDate}
            onChange={handleChange}
          />

          <input
            className="px-2 py-2 w-full rounded-lg focus:border-accent"
            type="text"
            id="slogan"
            placeholder="Company Slogan"
            value={formData.slogan}
            onChange={handleChange}
          />

          <input
            className="px-2 py-2 w-full rounded-lg focus:border-accent"
            type="number"
            id="numEmployees"
            placeholder="Number of Employees"
            value={formData.numEmployees}
            onChange={handleChange}
          />

          <input
            className="px-2 py-2 w-full rounded-lg focus:border-accent"
            type="text"
            id="contactInfo"
            placeholder="Contact Information (Phone or Email)"
            value={formData.contactInfo}
            onChange={handleChange}
          />

          <textarea
            className="px-2 py-2 w-full rounded-lg focus:border-accent"
            id="businessPurpose"
            placeholder="Business Purpose"
            value={formData.businessPurpose}
            onChange={handleChange}
          />

          <input
            className="px-2 py-2 w-full rounded-lg focus:border-accent"
            type="file"
            id="photos"
            multiple
            onChange={handleFileChange}
          />

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
            className="px-2 py-2 w-full rounded-lg focus:border-accent"
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
            className="px-4 py-2 bg-accent text-white rounded-lg w-full hover:bg-background2"
          >
            Submit Details
          </button>
        </form>
      </div>
    </div>
  );
}
