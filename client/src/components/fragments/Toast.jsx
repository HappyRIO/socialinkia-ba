import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Toaster({ type, message }) {
  // useEffect to trigger notifications when `type` or `message` changes
  useEffect(() => {
    if (type) {
      if (type === "success") {
        toast.success(message || "Success Notification!", {
          position: "top-left",
        });
      } else if (type === "error") {
        toast.error(message || "Error Notification!", {
          position: "top-left",
        });
      } else if (type === "warn") {
        toast.warn(message || "Warning Notification!", {
          position: "top-left",
        });
      } else if (type === "info") {
        toast.info(message || "Info Notification!", {
          position: "top-left",
        });
      } else {
        toast(message, {
          position: "top-left",
          className: "notification-bar",
        });
      }
    }
  }, [type, message]); // Trigger toast when `type` or `message` changes

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={5000} // Optional: auto close after 5 seconds
        hideProgressBar={false} // Optional: show progress bar
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </>
  );
}

export default Toaster;
