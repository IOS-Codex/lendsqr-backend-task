// routes/authRoutes.ts
import express from 'express';
import { createNewWallet } from '../controllers/walletControllers';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

// Route to create a new wallet
router.get('/create', authenticateUser, createNewWallet);




export default router;
