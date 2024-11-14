import { useState } from "react";

function ShadowControls() {
  // Initialize state for activeAttributes
  const [activeAttributes, setActiveAttributes] = useState({
    addShadow: false,
    shadowColor: "#000000",
    shadowBlur: 0,
    shadowX: 0,
    shadowY: 0,
  });

  // Function to handle changes in all inputs
  const handleInputChange = (event) => {
    const { name, type, value, checked } = event.target;
    setActiveAttributes((prevAttributes) => ({
      ...prevAttributes,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="shadow-controls">
      <input
        type="checkbox"
        name="addShadow"
        id="add-shadow"
        checked={activeAttributes.addShadow}
        onChange={handleInputChange}
      />
      <input
        type="color"
        name="shadowColor"
        id="shadow-color"
        value={activeAttributes.shadowColor}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="shadowBlur"
        id="shadow-blur"
        placeholder="Shadow Blur"
        value={activeAttributes.shadowBlur}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="shadowX"
        id="shadow-x"
        placeholder="Shadow X"
        value={activeAttributes.shadowX}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="shadowY"
        id="shadow-y"
        placeholder="Shadow Y"
        value={activeAttributes.shadowY}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default ShadowControls;
