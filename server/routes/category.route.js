// category.route.js
import express from 'express';
import { createCategory, getCategories } from '../controllers/category.controller.js';
import multer from 'multer'; // Import multer
import { isAdmin } from '../utils/isAdmin.js';

const router = express.Router();

// Multer middleware configuration for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Define the destination folder

router.post('/create', upload.single('image'), createCategory);
router.get('/categories', getCategories);

export default router;
