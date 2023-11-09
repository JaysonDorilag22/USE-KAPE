// product.controller.js
import Product from '../models/product.model.js';
import cloudinary from 'cloudinary';

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const images = req.files;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Name, description, price, and category are required' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      images: [],
    });

    if (images && images.length > 0) {
      for (const image of images) {
        const result = await cloudinary.v2.uploader.upload(image.path);
        newProduct.images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'An error occurred while creating the product' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
};
