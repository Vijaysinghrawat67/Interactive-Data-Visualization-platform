import axios from 'axios';
import {ApiError} from '../utils/ApiError.js';


const fetchDatafromApi = async(req, res, next) => {
    try {
        const {apiUrl} = req.body;
        if(!apiUrl) {
            return res.status(400).json({message: "API URL is required"});
        }
        const response = await axios.get(apiUrl);
        const apiData = response.data;
       

        if (!Array.isArray(apiData) || apiData.length === 0) {
            throw new ApiError(400, "API did not return valid array data");
        } 
        req.apiData = apiData;
        req.apiSchema = Object.keys(apiData[0]);

        next();
    } catch (error) {
        console.error("API Fetch Error:", error);
        next(new ApiError(500, "Failed to fetch or process API data"));
    }
};

export{
    fetchDatafromApi
}