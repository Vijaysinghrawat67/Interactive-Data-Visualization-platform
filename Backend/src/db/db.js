import mongoose from 'mongoose';
import { DB_Name } from '../config/constant.js';
import {config} from '../config/env.js';

const connectDB = async () => {

    try {
        const connectionInstance = await mongoose.connect
        (`${config.MONGODB_URI}/${DB_Name}`)
        console.log(`\n MongoDB connected || DB HOSt: 
         ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MONGODB connection faild...", error);
        process.exit(1);
    }
}

export default connectDB;