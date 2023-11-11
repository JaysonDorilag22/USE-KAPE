import express from 'express';
import multer from 'multer'; // Import multer
import { createProduct, deleteProduct, editProduct, getProducts } from '../controllers/product.controller.js';
import { isAdmin } from '../utils/isAdmin.js';
import { authenticateUser } from '../utils/authentication.middleware.js.js';

const router = express.Router();

// Multer middleware configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Define the destination folder

router.post('/create', authenticateUser, isAdmin, upload.array('images'), createProduct); // Use upload.array() to handle multiple images
router.get('/products', getProducts);
router.post('/update/:id',authenticateUser, isAdmin, editProduct);
router.delete('/delete/:id',authenticateUser, isAdmin, deleteProduct);

export default router;

