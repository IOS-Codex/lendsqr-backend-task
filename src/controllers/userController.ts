import { Request, Response } from 'express';
import knex from '../app';
import asyncHandler from "express-async-handler";
import validator from 'validator';
import bcrypt from 'bcrypt';

// Use environmental variables
import dotenv from 'dotenv';
import { checkEmailOnKarmaList, generateToken } from '../utils';
dotenv.config();




// This controller manages all API requests related to user interactions within the app,
// including sign-up, login, password reset, OTP verification, and more.

export const signUpUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

    // Check if the email exists on the karma list
    const isEmailOnKarmaList = await checkEmailOnKarmaList(email);

    if (isEmailOnKarmaList === true) {
        res.status(400).json({ message: 'You are not allowed on our platform' });
        return;
    } else if (isEmailOnKarmaList === false) {
        // Email is not present in the list, proceed with sign up

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await knex('users_table').insert({ fullName, email, mobileNumber, password: hashedPassword });

        // Return success response
        res.status(201).json({ message: 'Account created successfully', user: { fullName, email, mobileNumber } });
    } else {
        // Error occurred while checking karma list
        res.status(500).json({ message: 'Error checking karma list' });
    }
});



export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    // Destructure request body
    const { email, password } = req.body;

    // Check if required fields are provided        
    if (!email) {
        res.status(400).json({ message: 'Enter your Email Address' });
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

    // Check if the email exists in the database
    const user = await knex('users_table').where('email', email).first();
    if (!user) {
        res.status(400).json({ message: 'You do not have an account yet, Sign Up' });
        return;
    }

    // Check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (passwordIsCorrect) {
        // Generate JWT Token
        const token = generateToken(user.id);

        // Send HTTP-only cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 5), // 5 hours
            sameSite: "none",
            secure: true,
        });

        // Respond with user data and token
        const { id, fullName, email, mobileNumber } = user;
        res.status(200).json({ message: 'User logged in successfully', user: { id, fullName, email, mobileNumber, token } });
    } else {
        // Incorrect password
        res.status(401).json({ message: 'Incorrect password' });
    }


});
