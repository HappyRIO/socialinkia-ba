const User = require("../model/User");

// Check if session token is valid
const isSessionValid = (req, res, next) => {
  const { sessionToken } = req.cookies;

  if (!sessionToken) {
    console.log("No session token provided");
    return res.status(401).json({ error: "No session token provided." });
  }

  User.findOne({ sessionToken })
    .then((user) => {
      if (!user) {
        console.log("Invalid session token.");
        return res.status(401).json({ error: "Invalid session token." });
      }

      const expirationTime = new Date(user.sessionExpiresAt);
      const currentTime = new Date();
      if (expirationTime <= currentTime) {
        return res.status(401).json({ error: "Session expired." });
      }

      console.log("validating user....");

      req.user = user;
      next();
    })
    .catch((error) => {
      console.error("Error checking session validity:", error);
      res.status(500).json({ error: "Server error" });
    });
};

module.exports = isSessionValid;
