const express = require("express");
const JobCategories = require("../models/jobCategoriesModel");
const slugify = require("slugify");
const JobPost = require("./jobPostController");

//create
exports.createCategories = async (req, res) => {
  try {
    const { categoryName } = req.body;
    // const categoryName = req.body.categoryName.toLowerCase();

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const slug = slugify(categoryName, { lower: true });

    const existingCategory = await JobCategories.findOne({ categoryName });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists." });
    }

    const category = new JobCategories({ categoryName, slug });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//all categories
exports.getAll = async (req, res) => {
  try {
    const categories = await JobCategories.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//single category by ID
exports.getbyId = async (req, res) => {
  try {
    const category = await JobCategories.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found." });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update
exports.updateCategory = async (req, res) => {
  try {
    const categoryName = req.body.categoryName.toLowerCase();

    const existingCategory = await JobCategories.findOne({ categoryName });
    if (existingCategory && existingCategory._id.toString() !== req.params.id) {
      return res.status(409).json({ message: "Category already exists." });
    }

    const category = await JobCategories.findByIdAndUpdate(
      req.params.id,
      { categoryName },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete
exports.deleteCategory = async (req, res) => {
  try {
    const category = await JobCategories.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    res
      .status(200)
      .json({ message: "Category deleted successfully.", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
