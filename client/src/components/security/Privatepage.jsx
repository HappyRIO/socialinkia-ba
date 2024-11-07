import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function Privatepage({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === null) {
      const validateUser = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/check-user`,
            {
              method: "GET",
              credentials: "include", // Important for cookies
            }
          );

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            setError("Authentication failed. Redirecting to login...");
            navigate("/login");
          }
        } catch (error) {
          setIsAuthenticated(false);
          setError("Error authenticating. Redirecting to login...");
          console.error("Error validating user:", error);
          navigate("/login");
        }
      };

      validateUser();
    }
  }, [isAuthenticated, navigate]);

  if (error) {
    return <div>{error}</div>; // Display error if any
  }

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loading state while validating
  }

  return isAuthenticated ? <div>{children}</div> : null; // Only render children if authenticated
}

// Define prop types for `children`
Privatepage.propTypes = {
  children: PropTypes.node.isRequired,
};
