import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/AsyncHandler.js';
import {User} from '../models/user.model.js';


const userDashboard = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const user = await User.findById(userId).select("-password -refreshtoken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Get additional user data
    const accountAge = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)); // Days since account creation
    const lastUpdated = user.updatedAt; // Last profile update timestamp

    return res.status(200).json(
        new ApiResponse(200, {
            user,
            accountAge,
            lastUpdated,
        }, "User dashboard data fetched successfully")
    );
});



const adminDashboard = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const userCount = await User.countDocuments({ role: "user" });
    const adminCount = await User.countDocuments({ role: "admin" });

    // Get new users registered in the last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const newUsersLastWeek = await User.countDocuments({ createdAt: { $gte: last7Days } });

    // Get recently updated users
    const recentlyUpdatedUsers = await User.find({})
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("-password -refreshtoken");

    return res.status(200).json(
        new ApiResponse(200, {
            totalUsers,
            userCount,
            adminCount,
            newUsersLastWeek,
            recentUsers: recentlyUpdatedUsers,
        }, "Admin dashboard data fetched successfully")
    );
});


export{
    userDashboard,
    adminDashboard
}