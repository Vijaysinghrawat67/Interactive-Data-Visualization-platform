import {User} from '../models/user.model.js';
import {asyncHandler} from '../utils/AsyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';



const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find().select(
        '-password -refreshtoken'
    )
    res
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
    res
    .status(200)
    .json(
        new ApiResponse(200, user, "user deleted successfully")
    )
});

const updateeUserRole = asyncHandler(async(req, res) => {
    const{role} = req.body

    const user = await User.findById(req.params.is)
    if(!user){
        throw new ApiError(404, 'user not found')
    }
    
    user.role = role;
    await user.save();

    res
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
    .json(200, user, "user details fetched successfully")
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
    .statue(200)
    .json(200, {
        totalUsers, 
        adminCount,
        userCount,
        newUserLastWeek
    }, "user states fetched successfully")
});


export{
    getAllUsers,
    deleteUser,
    updateeUserRole,
    getSingleUser,
    getuserStatus
}