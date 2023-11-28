// category.route.js
import express from 'express';
import multer from 'multer';
import { createCategory, deleteCategory, updateCategory, getCategories, getCategory } from '../controllers/category.controller.js';
import { isAdmin } from '../utils/isAdmin.js';
import { authenticateUser } from '../utils/authentication.middleware.js.js';

const router = express.Router();


router.post('/create', authenticateUser, isAdmin, createCategory);
router.get('/categories', getCategories);
router.post('/update/:id',authenticateUser, isAdmin, updateCategory);
router.get('/get/:id', getCategory);
router.delete('/delete/:id',authenticateUser, isAdmin, deleteCategory);

export default router;
