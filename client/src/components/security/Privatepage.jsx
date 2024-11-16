import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);

  const validateUser = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/check-user`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      // setIsAuthenticated(response.ok);
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(true);
      console.error("Error validating user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
