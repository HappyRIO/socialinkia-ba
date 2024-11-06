import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function Privatepage({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.SERVER_BASE_URL}/api/auth/check-user`,
          {
            method: "GET",
            credentials: "include", // Important for cookies
          }
        );

        if (response.ok) {
          setIsAuthenticated(true); // Set auth state to true if the user is validated
        } else {
          setIsAuthenticated(false);
          navigate("/login"); // Redirect to login if not authenticated
        }
      } catch (error) {
        console.error("Error validating user:", error);
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    validateUser();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loading state while validating
  }

  return isAuthenticated ? <div>{children}</div> : null;
}

// Define prop types for `children`
Privatepage.propTypes = {
  children: PropTypes.node.isRequired,
};
