import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function Privatepage({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [error, setError] = useState(null); // State to hold error messages
  const navigate = useNavigate();

  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/check-user`,
          {
            method: "GET",
            credentials: "include", // Include cookies
          }
        );
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setError("Authentication failed. Please log in again.");
        }
      } catch (error) {
        setIsAuthenticated(false);
        setError("Error validating user. Please try again later.");
        console.error("Error validating user:", error);
      }
    };

    validateUser();
  }, [navigate]);

  // Show loading state while authentication is in progress
  if (isAuthenticated === null) {
    return (
      <div className="loading-spinner">
        {/* Optionally add a spinner or animation */}
        Loading...
      </div>
    );
  }

  // If authentication fails, display error message and redirect to login page
  if (!isAuthenticated) {
    return (
      <div>
        <p>{error}</p>
        <Navigate to="/login" />
      </div>
    );
  }

  // Render children if authenticated
  return <>{children}</>; // Correctly render children
}

// Define prop types for `children`
Privatepage.propTypes = {
  children: PropTypes.node.isRequired, // Ensure that 'children' is passed correctly
};
