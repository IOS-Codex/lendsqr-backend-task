import { Request, Response } from 'express';
import knex from '../app';
import asyncHandler from "express-async-handler";
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Use environmental variables
import dotenv from 'dotenv';
dotenv.config();



// This controller manages all API requests related to wallet interactions within the app,
// including creation of wallet, deletion of wallet, freezing wallets, and more.

export const createNewWallet = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {

        // Return success response
        res.status(200).json({ message: 'I am an Autheticated User', });
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error creating new wallet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



