import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/AsyncHandler.js';
import jwt from 'jsonwebtoken';
import {User} from '../models/user.model.js'
import {config} from '../config/env.js';



export const veryfyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer", "")

        if(!token){
            throw new ApiError(404, "unauthorized request")
        }

        const decodedtoken = jwt.verify(token, config.ACCESS_TOKEN )

        const user = await User.findById(decodedtoken?._id).select("-password -refreshtoken")

        if(!user){
            throw new ApiError(401, "Invalid access token")
        }

        req.user =  user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid accessToken")
    }
})
