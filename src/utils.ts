
import knex from './app';
import jwt from 'jsonwebtoken';
import axios, { AxiosResponse } from 'axios';



//funtion to generate jwt token
export const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET || '', { expiresIn: '5h' });
};


// Function to check if the email exists on the karma list
export async function checkEmailOnKarmaList(email: string): Promise<boolean | undefined> {
    try {
        const response: AxiosResponse<any> = await axios.get(`${process.env.ADJUTOR_BASE_URL}/verification/karma/${email}`, {
            headers: {
                Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}`
            },
            validateStatus: function (status) {
                return (status >= 200 && status < 300) || status === 404; // Accept 200-299 and 404 Error codes as normal response
                // (" The error code 404 used to indicate that an email is
                //   not on the karmar list is actually not a good way as axios
                // just throws it as an error")
            }
        });

        return response.status === 200 ? true : false;
    } catch (error) {
        console.error('Error checking karma list:', error);
        return undefined;
    }
}


function generateRandomNumber(): number {
    // Generate a random number within the range of 1 billion to 10 billion
    // This ensures the number is always 10 digits long
    return Math.floor(Math.random() * 9000000000) + 1000000000;
}


// this function is to generate and unique wallet number
export async function generateUniqueWalletAddress(): Promise<number | undefined> {
    const walletAddressId = generateRandomNumber();
    console.log('Generated walletAddressId:', walletAddressId);

    // Check if the generated wallet number already exists in the database
    const existingWallet = await knex('wallet_table').where('addressId', walletAddressId).first();

    if (!existingWallet) {
        console.log('Unique walletAddressId:', walletAddressId);
        return walletAddressId;
    } else {
        // Recursive call to generate a new wallet address if the current one already exists
        return generateUniqueWalletAddress();
    }
}