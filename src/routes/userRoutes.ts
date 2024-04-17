// routes/authRoutes.ts
import express from 'express';
import { signUpUser, loginUser } from '../controllers/userControllers';

const router = express.Router();

// Route to sign up a new user
router.post('/signup', signUpUser);

// Route to sign up a new user
router.post('/login', loginUser);



export default router;
