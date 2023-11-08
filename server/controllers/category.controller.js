// category.controller.js
import Category from '../models/category.model.js';
import cloudinary from 'cloudinary';

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file; // Use req.file to access the uploaded image

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const newCategory = new Category({
      name,
      description,
      image: {
        public_id: '',
        url: '',
      },
    });

    if (image) {
      const result = await cloudinary.v2.uploader.upload(image.path);

      newCategory.image.public_id = result.public_id;
      newCategory.image.url = result.secure_url;
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
