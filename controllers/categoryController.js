import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
import mongoose from "mongoose";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required",
      });
    }

    const existingCategory = await categoryModel.findOne({ name });

    if (existingCategory) {
      return res.status(200).send({
        status: true,
        message: "Category already exists",
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    res.status(201).send({
      status: true,
      message: "Category has been created",
      category: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      error,
      message: "Error in category",
    });
  }
};

export const showAllCategoriesController = async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await categoryModel.find({});
    res.json({ status: true, categories });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, message: "Failed to fetch categories" });
  }
};

export const updateCategoryController = async (req, res) => {
  const { name, id } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "No category name provided" });
    }

    // Ensure `id` is a valid MongoDB ObjectID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Find the category by ID
    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the name field
    category.name = name;

    // Update the slug field
    category.slug = slugify(name.toLowerCase());

    // Save the updated category
    const updatedCategory = await category.save();

    res.status(200).json({
      status: true,
      message: "Category has been updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, message: "Failed to update category" });
  }
};

export const deleteCategoryController = async (req, res) => {
  const categoryId = req.params.id; // Extract category ID from the request parameters
  try {
    // Check if the category exists
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete the category
    await category.deleteOne();

    res
      .status(200)
      .json({ status: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: false, message: "Failed to delete category" });
  }
};
