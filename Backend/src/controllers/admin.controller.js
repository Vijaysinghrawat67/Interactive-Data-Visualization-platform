import {User} from '../models/user.model.js';
import {asyncHandler} from '../utils/AsyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';




const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find().select(
        '-password -refreshtoken'
    )
     return res
    .status(200)
    .json(
        new ApiResponse(200, users)
    )
});


const deleteUser = asyncHandler(async(req, res) => {
    const user  = await User.findById(req.params.id)
    if(!user){
        throw new ApiError(404, 'user not found')
    }

    await User.findByIdAndDelete(req.params.id);
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "user deleted successfully")
    )
});

const updateeUserRole = asyncHandler(async(req, res) => {
    const{role} = req.body

    const user = await User.findById(req.params.id)
    if(!user){
        throw new ApiError(404, 'user not found')
    }

    if (req.user.role === "user") {
        throw new ApiError(403, "Unauthorized. Only admins can change user roles.");
    }
    if (req.user.role === "admin" && user.role !== "user") {
        throw new ApiError(403, "Unauthorized. Admins can only modify users.");
    }
    if (req.user.role === "super-admin" && role === "super-admin" && user.role !== "admin") {
        throw new ApiError(403, "Unauthorized. Super Admins can modify admins & users but not other super-admins.");
    }

    if (!["super-admin", "admin", "user"].includes(role)) {
        throw new ApiError(400, "Invalid role. Allowed roles: 'admin', 'user'");
    }

    user.role = role;
    await user.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "user role updated successfully")
    )
});


const getSingleUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).select(
        '-password -refreshtoken'
    );

    if(!user){
        throw new ApiError(404, 'user not found')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "user details fetched successfully")
    )
});


const getuserStatus = asyncHandler(async(req, res) => {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({role : 'admin'});
    const userCount = totalUsers - adminCount;

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const newUserLastWeek = await User.countDocuments({
        createdAt : {$gte : last7Days}
    });


    return res
    .status(200)
    .json( new ApiResponse (
        200, 
        totalUsers, 
        adminCount,
        userCount,
        newUserLastWeek
    , "user states fetched successfully"))
});


const registerAdmin = asyncHandler(async(req, res) => {
    if(req.user.role !== "super-admin"){
        throw new ApiError(403, "Unauthorize! Only admin can register a new admin")
    }

    const {username, email, password, name } = req.body;

    if([name, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!");  
    }

    const existingUser = await User.findOne({
        $or : [{email}, {username}]
    })
    if(existingUser){
        throw new ApiError(400, "user with username or email already exists!");
    }


    const user = await User.create({
        name,
        email,
        password,
        username: username.toLowerCase(),
        role: "admin"
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, " new admin user registered successfully")
    )
})



export{
    getAllUsers,
    deleteUser,
    updateeUserRole,
    getSingleUser,
    getuserStatus,
    registerAdmin
}
