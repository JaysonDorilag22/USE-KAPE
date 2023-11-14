// product.controller.js
import Product from '../models/product.model.js';
import cloudinary from 'cloudinary';

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    const images = req.files;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Name, description, price, and category are required' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      quantity: quantity || 0, 
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

export const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category, quantity } = req.body;
    const images = req.files;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;

    if (images && images.length > 0) {
      // Handle image updates as needed
      product.images = [];
      for (const image of images) {
        const result = await cloudinary.v2.uploader.upload(image.path);
        product.images.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error editing product:', error);
    res.status(500).json({ error: 'An error occurred while editing the product' });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await Product.deleteOne({ _id: productId }); 

    res.status(204).send(); 
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'An error occurred while deleting the product' });
  }
};


