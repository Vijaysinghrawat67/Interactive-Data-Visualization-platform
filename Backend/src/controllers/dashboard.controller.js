import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/AsyncHandler.js';
import {User} from '../models/user.model.js';


const userDashboard = asyncHandler(async(req, res) => {
    const userId = req.user?._id;

    const user = await User.findById(userId).select(
        '-password - refreshtoken'
    )


    if(!user){
        throw new ApiError(404, "user not found")
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(200, "user dashboard successfully")
    )
});


const adminDashboard = asyncHandler(async(req, res) => {
    const totalUsers = await User.countDocuments();

    const userCount = await User.countDocuments({role : 'user'})
    const adminCount  = await User.countDocuments({role : 'admin'})

    const recentUsers = await User.find({})
    .sort({createdAt : -1})
    .limit(5)
    .select('-password -refreshtoken');

    return res 
    .status(200)
    .json(
        new ApiResponse(200, {
            totalUsers,
            userCount,
            adminCount,
            recentUsers,
        }, "Admin dashboard data fetched successfully")
    )
});


export{
    userDashboard,
    adminDashboard
}