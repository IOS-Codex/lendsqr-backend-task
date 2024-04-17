import { Request, Response } from 'express';
import knex from '../app';
import asyncHandler from "express-async-handler";
import validator from 'validator';
import bcrypt from 'bcrypt';


// This controller manages all API requests related to user interactions within the app,
// including sign-up, login, password reset, OTP verification, and more.

export const signUpUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        // Destructure request body
        const { fullName, email, mobileNumber, password } = req.body;

        // Check if required fields are provided
        if (!fullName) {
            res.status(400).json({ message: 'Enter your full name' });
            return;
        }
        if (!email) {
            res.status(400).json({ message: 'Enter your Email Address' });
            return;
        }
        if (!mobileNumber) {
            res.status(400).json({ message: 'Enter your Phone Number' });
            return;
        }
        if (!password) {
            res.status(400).json({ message: 'Provide a Password' });
            return;
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }

        // Check if the email already exists in the database
        const existingUser = await knex('users_table').where('email', email).first();
        if (existingUser) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await knex('users_table').insert({ fullName, email, mobileNumber, password: hashedPassword });

        // Return success response
        res.status(201).json({ message: 'User created successfully', user: { fullName, email, mobileNumber } });
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error signing up user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
