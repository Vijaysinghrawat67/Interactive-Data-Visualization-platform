import {User} from '../models/user.model.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/AsyncHandler.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';



const generateAccessAndRefreshtoken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = User.generateAccessToken()
        const refreshtoken = User.generateRefreshToken()

        user.refreshtoken = refreshtoken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshtoken}
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token!")
    }
}


const registerUser = asyncHandler(async(req, res) => {
    const {name, email,password, username, } = req.body;
    //console.log(req.body)

    if([name, email, username, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required!");  
    }

    const existedUser = await User.findOne({
        $or : [{email}, {username}]
    })

    if(existedUser){
        throw new ApiError(400, "user with username already exists!");
    }

    const user = await User.create({
        name,
        email,
        password,
        username: username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "user registered successfully")
    )
});


const loginUser = asyncHandler(async(req, res) => {
    const {username, email, password} = req.body

    if(!username && !email){
        throw new ApiError(400, "username or email is required!")
    }

    const user = await User.findOne({
        $or : [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "user does not exist!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "password is incorrect!")
    }

    const {accessToken, refreshtoken} = await generateAccessAndRefreshtoken(user._id)

    const logedInUser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json(
        new ApiResponse(200, {user : logedInUser, accessToken, refreshtoken},
            "user logged in successfully"
        )
    )
})


const logOutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset :{refreshtoken : 1}
        },
        { new : true}
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshtoken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"))
})


const changePassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(401, "old password is incorrect!")
    }

    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"))
})



export {
    registerUser,
    loginUser,
    logOutUser,
    changePassword,

    
}