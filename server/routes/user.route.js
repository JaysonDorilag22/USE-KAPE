import express from 'express';
import { test } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verify.User.js';
import { verifyTokenAdmin } from '../utils/verify.Admin.js';
import { updateUser, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyTokenAdmin, deleteUser);

export default router;