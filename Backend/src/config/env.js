import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve(process.cwd(), '.env')});

const requiredEnvVars = ["PORT","MONGODB_URI"];

requiredEnvVars.forEach((key) =>{
    if(!process.env[key]){
        console.error(`Missing required environment variable ${key}`);
        process.exit(1);
    }
});

export const config = {
    PORT : process.env.PORT || 2000,
    MONGODB_URI : process.env.MONGODB_URI,
    

    REFRESH_TOKEN : process.env.REFRESH_TIKEN_SECRET,
    ACCESS_TOKEN : process.env.ACCESS_TOKEN_SECRET,
    ACCESS_EXP : process.env.ACCESS_TOKEN_SECRET_EXPIRY,
    REFRESH_EXP : process.env.REFRESH_TOKEN_SECRET_EXPIRY,

    origin : process.env.CORS_ORIGIN
};