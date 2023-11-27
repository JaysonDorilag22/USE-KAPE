// product.controller.js
import Product from '../models/product.model.js';
import { errorHandler } from '../utils/error.js';


export const createProduct = async (req, res, next) => {
 try {
  const product = await Product.create(req.body);
  return res.status(201).json(product);
 } catch (error) {
   next(error);
 }
};

export const getProducts = async (req, res, next) => {
  try {
    let searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const products = await Product.find({
      name: { $regex: searchTerm, $options: 'i' },
    })
      .sort({ [sort]: order });

    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};


export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(errorHandler(404, 'Product not found!'));
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;

    const products = await Product.find({ category: categoryId })
      .populate('category', 'name'); 

    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(errorHandler(404, 'Product not found!'));
  }
 
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct= async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(errorHandler(404, 'Product not found!'));
  }

  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json('Product has been deleted!');
  } catch (error) {
    next(error);
  }
};


