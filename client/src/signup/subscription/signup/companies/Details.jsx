import { useState } from "react";
import axios from "axios";

const BusinessForm = () => {
  const [formData, setFormData] = useState({
    category: "",
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
    ageRange: [],
    valuableContent: [],
    communicationStyle: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("YOUR_BACKEND_URL", formData);
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleFormSubmission}>
      <select name="category" onChange={handleChange}>
        <option value="">Select Category</option>
        <option value="Fashion and accessories">Fashion and accessories</option>
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

      <select name="addressVisible" onChange={handleChange}>
        <option value="NO">
          Should the physical address of the business appear?
        </option>
        <option value="Yeah">Yeah</option>
      </select>

      <input
        type="text"
        name="country"
        placeholder="Where the company is located (COUNTRY)"
        onChange={handleChange}
      />
      <input
        type="text"
        name="province"
        placeholder="Province"
        onChange={handleChange}
      />
      <input
        type="text"
        name="locality"
        placeholder="Locality"
        onChange={handleChange}
      />
      <input
        type="text"
        name="postalCode"
        placeholder="Postal code"
        onChange={handleChange}
      />
      <input
        type="text"
        name="address"
        placeholder="Address (Plaza street, local)"
        onChange={handleChange}
      />
      <input
        type="text"
        name="website"
        placeholder="Web page"
        onChange={handleChange}
      />
      <input
        type="text"
        name="phone"
        placeholder="Telephone (+34)"
        onChange={handleChange}
      />

      <select name="schedule" onChange={handleChange}>
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

      <select name="salesChannel" onChange={handleChange}>
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
        type="text"
        name="motto"
        placeholder="Motto"
        onChange={handleChange}
      />
      <input
        type="text"
        name="highlight"
        placeholder="What would you like to highlight about your business?"
        onChange={handleChange}
      />
      <input
        type="text"
        name="productService"
        placeholder="Star service or product"
        onChange={handleChange}
      />
      <input
        type="text"
        name="featuresBenefits"
        placeholder="Features and/or Benefits"
        onChange={handleChange}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export default BusinessForm;
