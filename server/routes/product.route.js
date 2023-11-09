import express from 'express';
import multer from 'multer'; // Import multer
import { isAdmin } from '../utils/isAdmin.js';
import { createProduct, getProducts } from '../controllers/product.controller.js';

const router = express.Router();

// Multer middleware configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Define the destination folder

router.post('/create', upload.array('images'), createProduct); // Use upload.array() to handle multiple images
router.get('/products', getProducts);

export default router;

