const mongoose = require("mongoose");

// Define a Mongoose schema for the template
const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Object, required: true }, // Store canvas data as a JSON object
});

const Template = mongoose.model("Template", TemplateSchema);

module.exports = Template;
