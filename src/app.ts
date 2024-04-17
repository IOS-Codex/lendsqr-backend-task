import express from 'express';
import bodyParser from 'body-parser';
import knex from 'knex';
import environmentConfig from '../knexfile';

// Use environmental variables
import dotenv from 'dotenv';
dotenv.config();

//import middlewares
import { errorHandler } from './middleware/errorMiddleware';

// Extracting Connection Variables environment configuration 
const { connectionVariables } = environmentConfig;

// Creating a Knex instance with the Connection Variables configuration
const db = knex(connectionVariables);

// Test database connection
db.raw('SELECT 1+1 as result')
    .then((result: any) => {
        console.log('Database connection successful');

        // Creating an express app
        const app = express();


        // All Middlewares

        // Middleware to parse json data.
        app.use(bodyParser.json());

        //Error handler middleware
        app.use(errorHandler);


        // Start the Express server
        const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error: any) => {
        console.error('Error connecting to the database:', error);
        // Exit the process if there is an error connecting to the database
        process.exit(1);
    });
