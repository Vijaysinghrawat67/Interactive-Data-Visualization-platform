import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { logActivity } from '../utils/logActivity.js';




const generateAccessAndRefreshtoken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "user not found")
        }

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        // console.log("refreshtokeen is : ",refreshToken);
        // console.log(accessToken);

        user.refreshtoken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token!")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, username, } = req.body;
    //console.log(req.body)

    if ([name, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
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

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user");
    }

    await logActivity({
        actiontype: "register",
        userId: user._id,
        title: `Registered new account as "${username}"`,
        meta: { email, username },
    })

    return res.status(201).json(
        new ApiResponse(201, createdUser, "user registered successfully")
    )
});


const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "username or email is required!")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "user does not exist!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "password is incorrect!")
    }

    const { accessToken, refreshtoken } = await generateAccessAndRefreshtoken(user._id)

    const logedInUser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    await logActivity({
        actiontype: "login",
        userId: user._id,
        title: `Logged in as "${username}"`,
        meta: { loginMethod: email ? "email" : "username" },
    })

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(
            new ApiResponse(200, { user: logedInUser, accessToken, refreshtoken },
                "user logged in successfully"
            )
        )
})


const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshtoken: 1 }
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshtoken", options)
        .json(new ApiResponse(200, {}, "user logged out successfully"))
})


const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both old and new passwords are required.");
    }

    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "old password is incorrect!")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password changed successfully"))
})


const updateUerInfo = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized access!");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const { name, username, email, bio, phNumber, location, website, github, linkedin } = req.body;

    let profileImageUrl = user.profileImage;

    // Handle profile image upload
    if (req.file && req.file.path) {
        const normalizePath = path.resolve(req.file.path);

        try {
            const uploadImage = await uploadOnCloudinary(normalizePath);
            if (!uploadImage?.url) {
                throw new ApiError(500, "Failed to upload image to cloud");
            }
            profileImageUrl = uploadImage.url;

            // Clean up local file
            if (fs.existsSync(normalizePath)) {
                fs.unlinkSync(normalizePath);
            }
        } catch (error) {
            console.error(`Image upload error: ${error.message}`);
            if (fs.existsSync(normalizePath)) {
                fs.unlinkSync(normalizePath);
            }
            throw new ApiError(500, "Image upload failed");
        }
    }

    // Update basic fields
    user.name = name || user.name;
    user.username = username?.toLowerCase() || user.username;
    user.email = email || user.email;
    user.phNumber = phNumber || user.phNumber;
    user.profileImage = profileImageUrl;
    user.bio = bio || user.bio;
    user.location = location || user.location;

    // Ensure socialLinks object exists
    if (!user.socialLinks) {
        user.socialLinks = {};
    }

    // Update social links safely
    user.socialLinks.website = website || user.socialLinks.website || "";
    user.socialLinks.github = github || user.socialLinks.github || "";
    user.socialLinks.linkedin = linkedin || user.socialLinks.linkedin || "";

    

    // Save updated user
    await user.save();

    const updatedUser = await User.findById(user._id).select("-password -refreshtoken");
   // console.log("Updating social links:", user.socialLinks);
    // Log user activity
    await logActivity({
        actiontype: "userInfoUpdate",
        userId: user._id,
        title: `Updated profile information`,
        meta: {
            changedFields: Object.keys(req.body),
            updatedUsername: username,
            updatedEmail: email,
        },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});



const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized access")
    }

    const user = await User.findById(userId).select(
        "-password -refreshtoken"
    )

    if (!user) {
        throw new ApiError(404, "user not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "user fetched successfully")
        );
});




export {
    registerUser,
    loginUser,
    logOutUser,
    changePassword,
    updateUerInfo,
    getCurrentUser

}