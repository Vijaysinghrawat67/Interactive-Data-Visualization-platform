import {v2, cloudinary} from 'cloudinary';
import {config} from '../config/env.js';
import fs from 'fs';

cloudinary.config({
    cloud_name : config.CLOUD_NAME,
    api_key : config.CLOUD_API_KEY,
    api_secret : config.CLOUD_SECRET
});


const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type : 'auto',
        })

        //console.log()
        fs.unlinkSync(localFilePath);
        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath);
    }
}

export {uploadOnCloudinary};