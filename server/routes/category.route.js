// category.route.js
import express from 'express';
import multer from 'multer';
import { createCategory, deleteCategory, editCategory, getCategories } from '../controllers/category.controller.js';
import { isAdmin } from '../utils/isAdmin.js';
import { authenticateUser } from '../utils/authentication.middleware.js.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/create', authenticateUser, isAdmin, upload.array('images'), createCategory);
router.get('/categories', getCategories);
router.put('/update/:id',authenticateUser, isAdmin, editCategory);
router.delete('/delete/:id', authenticateUser, isAdmin, deleteCategory);

export default router;
