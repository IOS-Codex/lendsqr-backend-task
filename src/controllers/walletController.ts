import { Request, Response } from 'express';
import knex from '../app';
import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';

// Use environmental variables
import dotenv from 'dotenv';
import { generateUniqueWalletAddress } from '../utils';
dotenv.config();




// This controller manages all API requests related to wallet interactions within the app,
// including creation of wallet, deletion of wallet, freezing wallets, creation of wallet pin and more.

export const createNewWallet = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const walletAddressId = await generateUniqueWalletAddress();

    console.log(walletAddressId)

    if (walletAddressId !== undefined) {
        // Insert the new wallet into the database alongside the user's data
        await knex('wallet_table').insert({ addressId: walletAddressId, userId: req.user.id, balance: 0 });

        // Return success response
        res.status(200).json({ message: 'Wallet created successfully', user: { addressId: walletAddressId, balance: 0 } });
    } else {
        // Handle the case where a unique walletAddressId could not be generated
        res.status(500).json({ message: 'Failed to generate a unique wallet address ID' });
    }
});

export const createWalletPin = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    // Destructure request body
    const { walletPin: pin, walletAddressId } = req.body;

    // Convert pin to integer
    const walletPin = parseInt(pin);

    // Check if required fields are provided
    if (!walletPin) {
        res.status(400).json({ message: 'Enter your new pin' });
        return;
    }
    if (!walletAddressId) {
        res.status(400).json({ message: 'No wallet selected' });
        return;
    }


    // Check if the wallet exists in the database
    const existingWallet = await knex('wallet_table').where('addressId', walletAddressId).first();
    if (!existingWallet) {
        res.status(400).json({ message: 'Wallet cannot be found' });
        return;
    }

    //check if the wallet belongs to the logged in user
    if (existingWallet.userId !== req.user.id) {
        console.log('A user tried to create a pin for a different user wallet', existingWallet.addressId)
        res.status(400).json({ message: 'An error occured while creating your Pin' });
        return;
    }

    // Encrypt the pin
    const hashedPin = await bcrypt.hash(walletPin.toString(), 10);



    // Update the wallet column with the wallet pin in the database 
    await knex('wallet_table').update({ walletPin: walletPin }).where('addressId', walletAddressId);


    // Return success response
    res.status(200).json({ message: 'Wallet Pin created successfully' });

});



