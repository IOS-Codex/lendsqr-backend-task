// routes/authRoutes.ts
import express from 'express';
import { fundWallet, transferToOtherWallet, withdrawFromWallet } from '../controllers/transactionController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

// Route to create a new transaction
router.post('/fundwallet', authenticateUser, fundWallet);

// Route to transfer funds to a new wallet
router.post('/transfertowallet', authenticateUser, transferToOtherWallet);

// Route to transfer funds to a new wallet
router.post('/withdrawfromwallet', authenticateUser, withdrawFromWallet);




export default router;
