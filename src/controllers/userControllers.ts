
import { Request, Response } from 'express';
import knex from '../app';
import asyncHandler from "express-async-handler"



//Generate a QR Code for documents (starting with Contract of sales)
export const signUpUser = asyncHandler(async (req: Request, res: Response) => {




    res.status(200).json({ message: 'Controller was fired' });
})


