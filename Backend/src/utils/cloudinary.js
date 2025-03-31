import {v2 as cloudinary} from 'cloudinary';
import {config} from '../config/env.js';
import fs from 'fs';
import path from 'path';

cloudinary.config({
    cloud_name : config.CLOUD_NAME,
    api_key : config.CLOUD_API_KEY,
    api_secret : config.CLOUD_SECRET
});


const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath){
            throw new Error("local file path is required!");
        }

        const normalizePath = path.resolve(localFilePath);

        const result = await cloudinary.uploader.upload(normalizePath, {
            resource_type : 'auto',
        })

        //console.log()
        if(fs.existsSync(normalizePath)){
             fs.unlinkSync(normalizePath);
             //console.log(`File deleted successfully: ${normalizePath}`);
        } else{
            //console.warn(`File already deleted or not found at path : ${normalizePath}`);
        }
        return result;

    } catch (error) {
       // console.error(`error during cloudinary upload : ${error.message}`);

        // Ensure cleanup of local file in case of failure
        const normalizePath = path.resolve(localFilePath);
        if(fs.existsSync(normalizePath)){
            fs.unlinkSync(normalizePath);
        }

        throw new Error("failed to upload image on cloudinary!");
        
    }
};

export {uploadOnCloudinary};