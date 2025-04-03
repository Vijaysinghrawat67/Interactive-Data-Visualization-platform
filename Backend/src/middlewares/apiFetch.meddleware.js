import axios from 'axios';


export const fetchDatafromApi = async(req, res, next) => {
    try {
        const {apiUrl} = req.body;
        if(!apiUrl) {
            return res.status(400).json({message: "API URL is required"});
        }
        const response = await axios.get(apiUrl);
        req.apiData = response.data;
        next();
    } catch (error) {
        return res.status(500)
        .json({
            message : "Failed to fetch data from API"
        })
    }
};