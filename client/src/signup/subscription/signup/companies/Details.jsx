import { useState } from "react";

const BusinessForm = () => {
  const [loading, setLoading] = useState(false);
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
    businessDefinition: [],
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

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "photos" && Array.isArray(value)) {
          value.forEach((file) => form.append(key, file));
        } else {
          form.append(key, value);
        }
      });

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/user/details`,
        {
          method: "PUT",
          body: form,
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Details uploaded successfully");
        window.location.href = "/dashboard";
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
      <div className="useless w-full h-10 bg-background2"></div>
      <div className="form-space bg-background2 rounded-lg my-3">
        <form
          onSubmit={handleFormSubmission}
          className="w-full px-2 flex flex-col gap-2 py-3"
        >
          <input
            className="p-2 rounded-lg"
            type="text"
            name="UserName"
            placeholder="your user name"
            onChange={handleChange}
          />
          <input
            className="p-2 rounded-lg"
            type="file"
            name="logo"
            id="logo"
            onChange={handleChange}
          />

          <input
            className="p-2 rounded-lg"
            type="text"
            name="CompanyTradeName"
            placeholder="company's trade name"
            onChange={handleChange}
          />

          <select
            className="p-2 rounded-lg"
            name="category"
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="Fashion and accessories">
              Fashion and accessories
            </option>
            <option value="Music">Music</option>
            <option value="Leisure and free time">Leisure and free time</option>
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

          <select
            className="p-2 rounded-lg"
            name="addressVisible"
            onChange={handleChange}
          >
            <option value="NO">
              Should the physical address of the business appear?
            </option>
            <option value="Yes">Yes</option>
          </select>

          <input
            className="p-2 rounded-lg"
            type="text"
            name="country"
            placeholder="Where the company is located (COUNTRY)"
            onChange={handleChange}
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            name="province"
            placeholder="Province"
            onChange={handleChange}
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            name="locality"
            placeholder="Locality"
            onChange={handleChange}
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            name="postalCode"
            placeholder="Postal code"
            onChange={handleChange}
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            name="address"
            placeholder="Address (Plaza street, local)"
            onChange={handleChange}
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            name="website"
            placeholder="Web page"
            onChange={handleChange}
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            name="phone"
            placeholder="Telephone (+34)"
            onChange={handleChange}
          />

          <select
            className="p-2 rounded-lg"
            name="ageRange"
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
          <select
            className="p-2 rounded-lg"
            name="schedule"
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

          <select
            className="p-2 rounded-lg"
            name="salesChannel"
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

          <input
            className="p-2 rounded-lg"
            type="text"
            name="motto"
            placeholder="Motto"
            onChange={handleChange}
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            name="highlight"
            placeholder="What would you like to highlight about your business?"
            onChange={handleChange}
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            name="productService"
            placeholder="Star service or product"
            onChange={handleChange}
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            name="featuresBenefits"
            placeholder="Features and/or Benefits"
            onChange={handleChange}
          />

          <select
            className="p-2 rounded-lg"
            name="communicationStyle"
            onChange={handleChange}
          >
            <option value="">Style of Communication</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="professional">professional</option>
            <option value="friendly">Friendly</option>
            <option value="marketing">Marketing-focused</option>
          </select>

          <button
            className="p-2 px-4 bg-accent hover:bg-primary rounded-lg my-4"
            type="submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      <div className="useless w-full h-10 bg-background2 py-10"></div>
    </div>
  );
};

export default BusinessForm;
