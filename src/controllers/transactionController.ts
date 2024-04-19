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
    const { amount, walletAddressId, walletPin: pin } = req.body;

    // Convert pin to integer
    const walletPin = parseInt(pin);

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
        res.status(400).json({ message: 'No Wallet selected' });
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
        res.status(400).json({ message: 'You need to create a Wallet pin to fund your wallet' });
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

export const transferToOtherWallet = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Destructure request body
    const { amount, sourceWalletAddressId, destinationWalletAddressID, walletPin: pin } = req.body;

    // Convert pin to integer
    const walletPin = parseInt(pin);

    // Check if required fields are provided
    if (!amount || isNaN(amount)) {
        res.status(400).json({ message: 'Enter a valid amount' });
        return;
    }
    if (!walletPin || isNaN(walletPin)) {
        res.status(400).json({ message: 'Enter your Wallet Pin' });
        return;
    }
    if (!sourceWalletAddressId) {
        res.status(400).json({ message: 'Select a Wallet' });
        return;
    }
    if (!destinationWalletAddressID) {
        res.status(400).json({ message: 'Enter the Wallet you want to transfer to' });
        return;
    }

    try {
        // Start a transaction
        await knex.transaction(async (trx) => {
            // Check if the source wallet exists in the database
            const existingWallet = await trx('wallet_table').where('addressId', sourceWalletAddressId).first();
            if (!existingWallet) {
                res.status(400).json({ message: 'Your Wallet was not found' });
                return;
            }

            // Check if the wallet belongs to the logged in user
            if (existingWallet.userId !== req.user.id) {
                console.log('A user tried to transfer funds from a different user wallet', existingWallet.addressId)
                res.status(400).json({ message: 'An error occurred while transferring from your Wallet' });
                return;
            }

            // Check if source wallet has enough balance
            if (existingWallet.balance < amount) {
                res.status(400).json({ message: 'Insufficient funds' });
                return;
            }

            // Check if pin has been created
            if (existingWallet.walletPin === null) {
                res.status(400).json({ message: 'You need to create a Wallet pin to make transfer from your wallet' });
                return;
            }

            // Check if pin is correct
            if (existingWallet.walletPin !== walletPin) {
                res.status(400).json({ message: 'Incorrect Wallet pin' });
                return;
            }

            // Check if destination wallet exists
            const existingDestinationWallet = await trx('wallet_table').where('addressId', destinationWalletAddressID).first();
            if (!existingDestinationWallet) {
                res.status(400).json({ message: 'The Wallet you are transferring to cannot be found' });
                return;
            }

            // Calculate new balances for both wallets
            const newSourceWalletAmount = existingWallet.balance - Number(amount);
            const newDestinationWalletAmount = existingDestinationWallet.balance + Number(amount);

            // Update source wallet balance
            await trx('wallet_table').update({ balance: newSourceWalletAmount }).where('addressId', sourceWalletAddressId);

            // Update destination wallet balance
            await trx('wallet_table').update({ balance: newDestinationWalletAmount }).where('addressId', destinationWalletAddressID);

            // Insert transactions into the database
            const transStatus = 'completed';

            // Insert debit transaction for source wallet
            await trx('transaction_table').insert({ userId: req.user.id, walletId: existingWallet.id, transAmount: amount, transType: 'debit', transStatus, transDate: new Date() });

            // Insert credit transaction for destination wallet
            await trx('transaction_table').insert({ userId: existingDestinationWallet.userId, walletId: existingDestinationWallet.id, transAmount: amount, transType: 'credit', transStatus, transDate: new Date() });
        });

        // Return success response
        res.status(200).json({ message: 'Transfer successful' });
    } catch (error: any) {
        // Return error response
        res.status(500).json({ message: 'Transfer failed', error: error.message });
    }
});
