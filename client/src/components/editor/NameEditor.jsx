import React, { useState } from "react";
import Toaster from "../fragments/Toast";

// eslint-disable-next-line react/prop-types
function NameInput({ shape, onNameChange }) {
  const [name, setName] = useState(shape.attrs.name || ""); // Initial name

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      <Toaster type={"success"} message={"name updated successfully"} />;
      onNameChange(name); // Call the onNameChange callback when Enter is pressed
    }
  };

  return (
    <div className="name-input">
      <label htmlFor="name">Shape Name</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter new name"
        aria-label="Shape Name"
      />
    </div>
  );
}

export default NameInput;
