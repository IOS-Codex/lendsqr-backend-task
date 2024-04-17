import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import knex from 'knex';
import environmentConfig from '../knexfile';

//use environmental variables
import dotenv from 'dotenv';
dotenv.config();

// Extracting development environment configuration 
const { connectionVariables } = environmentConfig;


// Creating a Knex instance with the development environment configuration
const db = knex(connectionVariables);

// Test database connection
db.raw('SELECT 1+1 as result')
    .then((result: any) => {
        console.log('Database connection successful');
    })
    .catch((error: any) => {
        console.error('Error connecting to the database:', error);
    });


// creating an express app
const app = express();

// Middleware to parser json data.
app.use(bodyParser.json());

console.log(process.env.PORT)
//start the Express server
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
