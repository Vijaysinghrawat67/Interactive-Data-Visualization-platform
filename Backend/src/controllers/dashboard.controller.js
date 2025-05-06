import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/AsyncHandler.js';
import {User} from '../models/user.model.js';
import {Dashboard} from '../models/dashboard.model.js';



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

const myDashboard = asyncHandler(async (req, res) => {
    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized - User not found in request");
    }

    const dashboard = await Dashboard.findOne({ userId: req.user._id });

    if (!dashboard) {
        throw new ApiError(404, "Dashboard not found");
    }

    return res.status(200).json(
        new ApiResponse(200, dashboard, "Dashboard found successfully")
    );
});


const saveDashboard = asyncHandler(async (req, res) => {
    try {
        const { charts } = req.body;

        if (!charts || !Array.isArray(charts)) {
            return res.status(400).json({ message: "Invalid charts data" });
        }
        
        let dashboard = await Dashboard.findOne({ userId: req.user._id });

        if (!dashboard) {
            dashboard = new Dashboard({
                userId: req.user.id,
                charts
            });
        } else {
            dashboard.charts = charts;
        }
        await dashboard.save(); // Save the document instance

        return res.status(200).json({
            message: "Dashboard successfully saved"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});


export{
    userDashboard,
    adminDashboard,
    myDashboard,
    saveDashboard
}