// routes/authRoutes.ts
import express from 'express';
import { fundWallet, transferToOtherWallet } from '../controllers/transactionController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

// Route to create a new transaction
router.post('/fundwallet', authenticateUser, fundWallet);

// Route to transfer funds to a new wallet
router.post('/transfertowallet', authenticateUser, transferToOtherWallet);




export default router;
