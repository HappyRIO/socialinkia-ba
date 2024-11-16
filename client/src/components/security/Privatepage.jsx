import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Start as `true` to show the loading spinner initially

  const validateUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/check-user`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
      console.error("Error validating user:", err);
    } finally {
      setLoading(false); // Ensure loading is stopped regardless of success or failure
    }
  };

  useEffect(() => {
    validateUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
