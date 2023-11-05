import express from 'express';
import { forgotPassword, google, resetPassword, signOut, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.get('/signout', signOut);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:id/:token', resetPassword);
export default router;