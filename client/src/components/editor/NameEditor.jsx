import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line react/prop-types
function NameInput({ shape, onNameChange }) {
  const [name, setName] = useState(shape.attrs.name || ""); // Initial name

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      toast(`name changed to ${name}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      onNameChange(name); // Call the onNameChange callback when Enter is pressed
    }
  };

  return (
    <div className="name-input">
      <ToastContainer
        position="top-left"
        autoClose={3000} // Optional: auto close after 5 seconds
        hideProgressBar={false} // Optional: show progress bar
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
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
