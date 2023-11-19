// category.controller.js
import Category from '../models/category.model.js';
import cloudinary from 'cloudinary';

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const images = req.files;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const newCategory = new Category({
      name,
      description,
      images: [],
    });

    if (images && images.length > 0) {
      for (const image of images) {
        const result = await cloudinary.v2.uploader.upload(image.path);
        newCategory.images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'An error occurred while creating the category' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'An error occurred while fetching categories' });
  }
};

export const editCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;
    const images = req.files;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Update the category fields
    category.name = name || category.name;
    category.description = description || category.description;

    if (images && images.length > 0) {
      // Handle image updates as needed
      category.images = [];
      for (const image of images) {
        const result = await cloudinary.v2.uploader.upload(image.path);
        category.images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    const updatedCategory = await category.save();

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error editing category:', error);
    res.status(500).json({ error: 'An error occurred while editing the category' });
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Retrieve the list of image public_ids associated with the category
    const imagePublicIds = category.images.map((image) => image.public_id);

    // Delete all images associated with the category from Cloudinary
    if (imagePublicIds.length > 0) {
      await Promise.all(
        imagePublicIds.map(async (publicId) => {
          await cloudinary.uploader.destroy(publicId);
        })
      );
    }

    // Delete the category from the database
    await Category.findByIdAndDelete(categoryId);

    res.status(201).json({
      success: true,
      message: 'Category deleted',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

