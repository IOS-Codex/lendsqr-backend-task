import dotenv from 'dotenv';
dotenv.config();

//define the types for the connection Variables
interface DatabaseCredentials {
    host: string;
    database: string;
    user: string;
    password: string;
}

let credentials: DatabaseCredentials;

//assign values to connect with the database based on connection environment
if (process.env.NODE_ENV === 'production') {
    credentials = {
        host: process.env.PROD_DATABASE_HOST!,
        database: process.env.PROD_DATABASE_NAME!,
        user: process.env.PROD_DATABASE_USER!,
        password: process.env.PROD_DATABASE_PASSWORD!
    };
} else {
    credentials = {
        host: process.env.DEV_DATABASE_HOST!,
        database: process.env.DEV_DATABASE_NAME!,
        user: process.env.DEV_DATABASE_USER!,
        password: process.env.DEV_DATABASE_PASSWORD!
    };
}

export default credentials;
