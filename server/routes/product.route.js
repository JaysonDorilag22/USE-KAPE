import express from 'express';
import multer from 'multer'; // Import multer
import { isAdmin } from '../utils/isAdmin.js';
import { authenticateUser } from '../utils/authentication.middleware.js.js';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.post('/create', createProduct); 
router.get('/products', getProducts);
router.get('/get/:id', getProduct);
router.post('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

export default router;

