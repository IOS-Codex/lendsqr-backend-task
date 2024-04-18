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
    res.send("Hey, i amd up and running")
})


//Error handler middleware
app.use(errorHandler);


// Start the Express server
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
