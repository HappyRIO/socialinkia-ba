import { useState, useEffect } from "react";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import { toast, ToastContainer } from "react-toastify";
import { Facebook, Instagram } from "lucide-react";

export default function Profile() {
  const [formData, setFormData] = useState({
    UserName: "",
    category: "",
    CompanyTradeName: "",
    addressVisible: "NO",
    country: "",
    province: "",
    locality: "",
    postalCode: "",
    address: "",
    website: "",
    contactMethod: "",
    phone: "",
    schedule: "",
    salesChannel: "",
    motto: "",
    businessDefinition: "",
    highlight: "",
    productService: "",
    featuresBenefits: "",
    additionalProducts: [],
    publicationObjective: "",
    photos: [],
    serviceArea: "",
    customerType: [],
    ageRange: "",
    valuableContent: [],
    communicationStyle: "",
  });

  const [loading, setLoading] = useState(false);
  const [connectfb, setconnectfb] = useState(false);
  const [connectig, setconnectig] = useState(false);

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
        setFormData({
          ...formData,
          ...data.user.companyDetails,
          photos: data.user.companyDetails?.photos || [],
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photos") {
      setFormData((prev) => ({
        ...prev,
        photos: files ? Array.from(files) : [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "photos" && Array.isArray(value)) {
        value.forEach((file) => form.append(key, file));
      } else {
        form.append(key, value);
      }
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/user/details`,
        {
          method: "PUT",
          body: form,
          credentials: "include",
        }
      );

      if (response.ok) {
        toast("Profile updated successfully", { theme: "dark" });
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

  function openAuthPopup(url, onSuccess) {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const authWindow = window.open(
      url,
      "AuthPopup",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const timer = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(timer);
        onSuccess();
      }
    }, 500);
  }

  function handleconnectFacebook() {
    openAuthPopup(
      `${import.meta.env.VITE_SERVER_BASE_URL}/api/meta/auth/facebook`,
      () => {
        setconnectfb(true);
        toast("Facebook connected", { theme: "dark" });
      }
    );
  }

  function handleconnectInstagram() {
    openAuthPopup(
      `${import.meta.env.VITE_SERVER_BASE_URL}/api/meta/auth/instagram`,
      () => {
        setconnectig(true);
        toast("Instagram connected", { theme: "dark" });
      }
    );
  }

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="side-bar">
        <ResponsiveSidebar pagename="Profile" />
      </div>
      <div className="w-full ml-0 sm:ml-64 pt-3 px-2 flex flex-col justify-center items-center">
        <div className="flex flex-row justify-between w-full px-4 py-2">
          <button
            onClick={handleconnectFacebook}
            className="bg-blue-500 text-white p-4 rounded-lg shadow-lg"
          >
            {connectfb ? "Facebook Connected" : "Connect Facebook"}
            <Facebook />
          </button>
          <button
            onClick={handleconnectInstagram}
            className="bg-red-400 text-white p-4 rounded-lg shadow-lg"
          >
            {connectig ? "Instagram Connected" : "Connect Instagram"}
            <Instagram />
          </button>
        </div>

        {loading && <div className="spinner">Loading...</div>}
        <form
          onSubmit={handleSubmit}
          className="form flex flex-col gap-2 justify-center"
        >
          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="UserName">
              User Name
            </label>
            <input
              type="text"
              name="UserName"
              className="p-2 rounded-lg"
              placeholder="Your User Name"
              value={formData.UserName}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="photos">
              Upload Photos
            </label>
            <input type="file" name="photos" multiple onChange={handleChange} />
          </div>

          <div className="flex flex-col">
            <label
              className="text-neutral-400 text-sm"
              htmlFor="CompanyTradeName"
            >
              Company Trade Name
            </label>
            <input
              type="text"
              className="p-2 rounded-lg"
              name="CompanyTradeName"
              placeholder="Company Trade Name"
              value={formData.CompanyTradeName}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label
              className="text-neutral-400 text-sm"
              htmlFor="CompanyTradeName"
            >
              Company's Trade Name
            </label>
            <input
              className="p-2 rounded-lg"
              type="text"
              name="CompanyTradeName"
              placeholder="company's trade name"
              value={formData.CompanyTradeName}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="category">
              Select Category
            </label>
            <select
              className="p-2 rounded-lg"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Fashion and accessories">
                Fashion and accessories
              </option>
              <option value="Music">Music</option>
              <option value="Leisure and free time">
                Leisure and free time
              </option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Bakery">Bakery</option>
              <option value="Hair salon">Hair salon</option>
              <option value="Data protection and GDPR">
                Data protection and GDPR
              </option>
              <option value="Psychology">Psychology</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Health- well-being">Health- well-being</option>
              <option value="Dental health">Dental health</option>
              <option value="Insurance">Insurance</option>
              <option value="IT Services">IT Services</option>
              <option value="Car workshop">Car workshop</option>
              <option value="Motorcycle workshop">Motorcycle workshop</option>
              <option value="Pet store">Pet store</option>
              <option value="Tourism">Tourism</option>
              <option value="Trips">Trips</option>
              <option value="Spirituality/ Esotericism">
                Spirituality/ Esotericism
              </option>
              <option value="Chiropodist">Chiropodist</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              className="text-neutral-400 text-sm"
              htmlFor="addressVisible"
            >
              Should the physical address of the business appear?
            </label>
            <select
              className="p-2 rounded-lg"
              name="addressVisible"
              value={formData.addressVisible}
              onChange={handleChange}
            >
              <option value="NO">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="country">
              Country
            </label>
            <input
              className="p-2 rounded-lg"
              type="text"
              name="country"
              placeholder="Where the company is located (COUNTRY)"
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="province">
              Province
            </label>
            <input
              className="p-2 rounded-lg"
              type="text"
              name="province"
              placeholder="Province"
              value={formData.province}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="locality">
              Locality
            </label>
            <input
              className="p-2 rounded-lg"
              type="text"
              name="locality"
              placeholder="Locality"
              value={formData.locality}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="postalCode">
              Postal Code
            </label>
            <input
              className="p-2 rounded-lg"
              type="text"
              name="postalCode"
              placeholder="Postal code"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="address">
              Address
            </label>
            <input
              className="p-2 rounded-lg"
              type="text"
              name="address"
              placeholder="Address (Plaza street, local)"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="website">
              Website
            </label>
            <input
              className="p-2 rounded-lg"
              type="text"
              name="website"
              placeholder="Web page"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="phone">
              Telephone (+34)
            </label>
            <input
              className="p-2 rounded-lg"
              type="text"
              name="phone"
              placeholder="Telephone (+34)"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="ageRange">
              Target Customer Age
            </label>
            <select
              className="p-2 rounded-lg"
              name="ageRange"
              value={formData.ageRange}
              onChange={handleChange}
            >
              <option value="">Target Customer Age</option>
              <option value="18 below">18 below</option>
              <option value="18 above">18 above</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-50">36-50</option>
              <option value="51+">51+</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="schedule">
              What days are you open?
            </label>
            <select
              className="p-2 rounded-lg"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
            >
              <option value="">What days are you open?</option>
              <option value="Week">
                Monday-Tuesday-Wednesday-Thursday-Friday-Saturday-Sunday
              </option>
              <option value="Week without weekends">
                Monday-Tuesday-Wednesday-Thursday-Friday
              </option>
              <option value="All weekend">Saturdays and Sundays</option>
              <option value="We never close">We never close</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="salesChannel">
              Sales or Customer Service Channels
            </label>
            <select
              className="p-2 rounded-lg"
              name="salesChannel"
              value={formData.salesChannel}
              onChange={handleChange}
            >
              <option value="">Sales or customer service channels</option>
              <option value="Ecommerce 24 hours">
                I am an ecommerce (online sales) store open 24 hours a day
              </option>
              <option value="Ecommerce with customer service">
                I am an Ecommerce (online sales) with customer service hours
              </option>
              <option value="Physical sales">
                In addition to an Ecommerce, I have a place with physical sales
              </option>
              <option value="Physical location only">
                I only have one physical location
              </option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="motto">
              Motto
            </label>
            <input
              className="p-2 rounded-lg"
              type="text"
              name="motto"
              placeholder="Motto"
              value={formData.motto}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-neutral-400 text-sm" htmlFor="highlight">
              Highlight about your business
            </label>
            <input
              className="p-2 rounded-lg"
              type="text"
              name="highlight"
              placeholder="What would you like to highlight about your business?"
              value={formData.highlight}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label
              className="text-neutral-400 text-sm"
              htmlFor="productService"
            >
              Star Service or Product
            </label>
            <input
              className="p-2 rounded-lg"
              type="text"
              name="productService"
              placeholder="Star service or product"
              value={formData.productService}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label
              className="text-neutral-400 text-sm"
              htmlFor="featuresBenefits"
            >
              Features and/or Benefits
            </label>
            <input
              className="p-2 rounded-lg"
              type="text"
              name="featuresBenefits"
              placeholder="Features and/or Benefits"
              value={formData.featuresBenefits}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label
              className="text-neutral-400 text-sm"
              htmlFor="communicationStyle"
            >
              Style of Communication
            </label>
            <select
              className="p-2 rounded-lg"
              name="communicationStyle"
              value={formData.communicationStyle}
              onChange={handleChange}
            >
              <option value="">Style of Communication</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="marketing">Marketing-focused</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-accent text-white rounded-lg w-full"
          >
            Submit Details
          </button>
        </form>
      </div>
    </div>
  );
}
