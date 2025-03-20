import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve(process.cwd(), '.env')});

const requiredEnvVars = ["PORT","MONGODB_URI","JWT_SECRET"];

requiredEnvVars.forEach((key) =>{
    if(!process.env[key]){
        console.error(`Missing required environment variable ${key}`);
        process.exit(1);
    }
});

export const config = {
    PORT : process.env.PORT || 5000,
    MONGODB_URI : process.env.MONGODB_URI,
    JWT_SECRET : process.env.JWT_SECRET,
};