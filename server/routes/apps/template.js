const express = require("express");
const router = express.Router();
const connectDB = require("../../data/db");
const Template = require("../../model/Template");

//get all template
router.get("/all", async (req, res) => {
  connectDB();
  try {
    const data = await Template.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Failed to retrieve templates" });
  }
});

// Route to save a template
router.post("/create", async (req, res) => {
  connectDB();
  const { name, data } = req.body;

  try {
    const newTemplate = new Template({ name, data });
    await newTemplate.save();
    res.status(201).json({ message: "Template saved successfully!" });
  } catch (error) {
    console.error("Error saving template:", error);
    res.status(500).json({ message: "Failed to save template" });
  }
});

// Route to load a template by ID
router.get("/:id", async (req, res) => {
  connectDB();
  const { id } = req.params;

  try {
    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json(template);
  } catch (error) {
    console.error("Error loading template:", error);
    res.status(500).json({ message: "Failed to load template" });
  }
});

// Route to update a template by ID
router.put("/:id", async (req, res) => {
  connectDB();
  const { id } = req.params;
  const { name, data } = req.body;

  try {
    const updatedTemplate = await Template.findByIdAndUpdate(
      id,
      { name, data },
      { new: true } // Returns the updated document
    );
    if (!updatedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }
    res
      .status(200)
      .json({ message: "Template updated successfully!", updatedTemplate });
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: "Failed to update template" });
  }
});

// Route to delete a template by ID
router.delete("/:id", async (req, res) => {
  connectDB();
  const { id } = req.params;

  try {
    const deletedTemplate = await Template.findByIdAndDelete(id);
    if (!deletedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json({ message: "Template deleted successfully!" });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ message: "Failed to delete template" });
  }
});

module.exports = router;
