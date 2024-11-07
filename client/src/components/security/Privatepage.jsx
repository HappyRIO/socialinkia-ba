import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ Component, isAuthenticated }) => {
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
