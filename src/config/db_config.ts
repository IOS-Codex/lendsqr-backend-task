import dotenv from 'dotenv';
dotenv.config();

//define the types for the connection Variables
interface DatabaseCredentials {
    connectionString: string;
}

let credentials: DatabaseCredentials;

//assign values to connect with the database based on connection environment
if (process.env.NODE_ENV === 'production') {
    credentials = {
        connectionString: process.env.PROD_DATABASE_STRING!,
    };
} else {
    credentials = {
        connectionString: `mysql://${process.env.DEV_DATABASE_USER}:${process.env.DEV_DATABASE_PASSWORD}@${process.env.DEV_DATABASE_HOST}/${process.env.DEV_DATABASE_NAME}`,
    };
}

export default credentials;
