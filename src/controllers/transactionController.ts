import { Request, Response } from 'express';
import knex from '../app';
import asyncHandler from "express-async-handler";

// Use environmental variables
import dotenv from 'dotenv';
dotenv.config();



// This controller manages all API requests related to transaction interactions within the app,
// including funding of wallet, transfer to other wallet,withdrawal from  wallet and more .

export const fundWallet = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    //no collecting funding source and verifiying the transaction because i think its not within the scope of the assessment.

    // Destructure request body
    const { amount, walletAddressId, walletPin } = req.body;

    // Check if required fields are provided
    if (!amount || isNaN(amount)) {
        res.status(400).json({ message: 'Enter a valid amount' });
        return;
    }
    if (!walletPin || isNaN(walletPin)) {
        res.status(400).json({ message: 'Enter your Wallet Pin' });
        return;
    }
    if (!walletAddressId) {
        res.status(400).json({ message: 'No wallet selected' });
        return;
    }

    // Check if the wallet exists in the database
    const existingWallet = await knex('wallet_table').where('addressId', walletAddressId).first();
    if (!existingWallet) {
        res.status(400).json({ message: 'Wallet not found' });
        return;
    }

    //check if the wallet belongs to the logged in user
    if (existingWallet.userId !== req.user.id) {
        console.log('A user tried to fund a different user wallet', existingWallet.addressId)
        res.status(400).json({ message: 'An error occured while funding your Wallet' });
        return;
    }

    //check if pin has been created
    if (existingWallet.walletPin === null) {
        res.status(400).json({ message: 'You need to create a wallet pin to fund your wallet' });
        return;
    }

    //check if pin is correct
    if (existingWallet.walletPin !== walletPin) {
        res.status(400).json({ message: 'Incorrect wallet pin' });
        return;
    }


    // Calculate new balance
    const newAmount = Number(amount) + existingWallet.balance;

    // Update the wallet balance in the database 
    const transaction = await knex('wallet_table').update({ balance: newAmount }).where('addressId', walletAddressId);

    // Insert the transaction into the database
    const transStatus = transaction ? 'completed' : 'failed';
    console.log(transStatus)

    await knex('transaction_table').insert({ userId: req.user.id, walletId: existingWallet.id, transAmount: amount, transType: 'credit', transStatus: transStatus, transDate: new Date() });

    // Return success or failure response
    res.status(200).json({ message: 'Wallet funded successfully' });

});



