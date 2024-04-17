// routes/authRoutes.ts
import express from 'express';
import { signUpUser } from '../controllers/userControllers';

const router = express.Router();

// Route to sign up a new user
router.post('/signup', signUpUser);



export default router;
