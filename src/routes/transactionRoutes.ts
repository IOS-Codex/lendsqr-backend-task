// routes/authRoutes.ts
import express from 'express';
import { fundWallet } from '../controllers/transactionController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

// Route to create a new transaction
router.get('/fund', authenticateUser, fundWallet);




export default router;
