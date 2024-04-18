// routes/authRoutes.ts
import express from 'express';
import { createNewWallet, createWalletPin } from '../controllers/walletController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

// Route to create a new wallet
router.get('/create', authenticateUser, createNewWallet);

// Route to create a new wallet
router.post('/createPin', authenticateUser, createWalletPin);




export default router;
