import express from 'express';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import knex from 'knex';
import environmentConfig from '../knexfile';

// Use environmental variables
import dotenv from 'dotenv';
dotenv.config();

//import middlewares
import { errorHandler } from './middleware/errorMiddleware';

//import routes
import userRoute from './routes/userRoutes';
import walletRoute from './routes/walletRoutes';
import transactionRoute from './routes/transactionRoutes';

// Creating a Knex instance with the Connection Variables configuration
const db = knex(environmentConfig);

export default db;

// Function to test database connection
async function testDatabaseConnection() {
    try {
        await db.raw('SELECT 1');
        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.error('Error connecting to database:', error);
        return false;
    }
}

// Creating an express app
const app = express();

// All Middlewares
// use middlewares
app.use((req: Request, res: Response, next: NextFunction) => {
    next()
})

// Parse JSON bodies
app.use(express.json()); // or app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

//routes middleware
app.use("/api/user", userRoute)
app.use("/api/wallet", walletRoute)
app.use("/api/transaction", transactionRoute)

// Home route
app.get("/", (req, res) => {
    res.send("Hey, I am up and running")
})

//Error handler middleware
app.use(errorHandler);

// Start the Express server after testing database connection
async function startServer() {
    const isConnected = await testDatabaseConnection();
    if (isConnected) {
        const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } else {
        console.log('Failed to connect to the database. Server not started.');
    }
}

// Start the server
startServer();
