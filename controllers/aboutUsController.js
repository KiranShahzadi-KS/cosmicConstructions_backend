const AboutUs = require("../models/aboutUsModel");

// Create a new About Us entry
exports.createAboutUs = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    const newAboutUs = new AboutUs({
      title,
      description,
      images: imageUrl,
    });

    await newAboutUs.save();

    res.status(201).json({
      message: "About Us entry created successfully.",
      data: newAboutUs,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All About Us entries
exports.getAllAboutUs = async (req, res) => {
  try {
    const aboutUsEntries = await AboutUs.find();

    res.status(200).json({
      message: "About Us entries retrieved successfully.",
      data: aboutUsEntries,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single About Us entry by ID
exports.getAboutUsById = async (req, res) => {
  try {
    const aboutUsEntry = await AboutUs.findById(req.params.id);

    if (!aboutUsEntry) {
      return res.status(404).json({ message: "About Us entry not found." });
    }

    res.status(200).json({
      message: "About Us entry retrieved successfully.",
      data: aboutUsEntry,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an About Us entry by ID
exports.updateAboutUs = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    const updatedData = {
      title,
      description,
      images: imageUrl,
    };

    const updatedAboutUs = await AboutUs.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedAboutUs) {
      return res.status(404).json({ message: "About Us entry not found." });
    }

    res.status(200).json({
      message: "About Us entry updated successfully.",
      data: updatedAboutUs,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
