import { Request, Response } from 'express';
import knex from '../app';
import asyncHandler from "express-async-handler";
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Use environmental variables
import dotenv from 'dotenv';
dotenv.config();


// this function is to generate the wallet number
function generateRandomNumber(): number {
    return Math.floor(1000000000 + Math.random() * 9000000000); // Generates a random 10-digit number
}

// This controller manages all API requests related to wallet interactions within the app,
// including creation of wallet, deletion of wallet, freezing wallets, and more.

export const createNewWallet = asyncHandler(async (req: Request, res: Response): Promise<void> => {


    let walletAddressId: number;
    let isUnique: boolean = false;
    walletAddressId = generateRandomNumber();

    while (!isUnique) {


        // Check if the generated wallet number already exists in the database
        const existingWallet = await knex('wallet_table').where('addressId', walletAddressId).first();

        if (!existingWallet) {
            isUnique = true;

            console.log(walletAddressId);
        }
    }




    // Insert the new wallet into the database alongside the user's data
    await knex('wallet_table').insert({ addressId: walletAddressId, userId: req.user.id, });


    // Return success response
    res.status(200).json({ message: 'Wallet created successfully', user: { addressId: walletAddressId } });

});



