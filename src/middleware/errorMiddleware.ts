import { Request, Response, NextFunction } from 'express';

// Use environmental variables
import dotenv from 'dotenv';
dotenv.config();


export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //log the error to console or third party logger for debugging purpose
    console.error(err.stack);

    // Check if headersSent is true. If true, the response headers have already been sent to the client,
    // and it's too late to send an error response.
    if (res.headersSent) {
        return next(err);
    }

    // Set the status code based on the error type or default to 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Set the response status code and send the error message
    res.status(statusCode).json({
        error: {
            message: err.message,
            statusCode: statusCode,
            // stack: process.env.NODE_ENV === "development" ? err.stack : null
        }
    });
};
