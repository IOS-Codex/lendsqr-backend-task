import { Request, Response, NextFunction } from 'express';
import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';
import knex from '../app';

// Use environmental variables
import dotenv from 'dotenv';
dotenv.config();


// Extend Request interface to include custom 'user' property
declare module 'express' {
    interface Request {
        user?: any;
    }
}

export const authenticateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ message: 'Not authorized, please login' });
            return;
        }

        // Verify Token
        const verifiedUser: any = jwt.verify(token, process.env.JWT_SECRET || '');

        // Get user Details (excluding the password) from the database using the token as ID 
        const user = await knex('users_table')
            .where('id', verifiedUser.id)
            .first()
            .select(knex.raw('*, NULL AS password'));

        if (!user) {
            res.status(404).json({ message: 'User Account not found' });
            return;
        }

        // Assign user object to request object for use in subsequent middleware/routes
        req.user = user;

        // Proceed to the next middleware/route
        next();
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error authenticating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
