// platformConfig.js
module.exports = {
  facebook: {
    handler: require("../routes/apps/Facebook"), // Path to Facebook API handler
    name: "Facebook",
    requiresMedia: true, // Indicates if media is required
  },
  instagram: {
    handler: require("../routes/apps/Instagram"), // Path to Instagram API handler
    name: "Instagram",
    requiresMedia: true,
  },
  googleMyBusiness: {
    handler: require("../routes/apps/Gmb"), // Path to GMB API handler
    name: "Google My Business",
    requiresMedia: false,
  },
};
