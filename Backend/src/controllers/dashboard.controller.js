import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/AsyncHandler.js';
import {User} from '../models/user.model.js';
import {Dashboard} from '../models/dashboard.model.js';
import {DataSource} from '../models/dataSource.model.js'
import {Export} from '../models/export.model.js';
import {Visualization} from '../models/visualization.model.js';
import mongoose from 'mongoose';



const userDashboard = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const user = await User.findById(userId).select("-password -refreshtoken");

  if (!user) {
    throw new ApiError(404, "User not found");

  }

  const objectUserId = new mongoose.Types.ObjectId(userId);

  // Get counts in parallel
  const [visualizationsCount, datasetsCount, exportsCount] = await Promise.all([
    Visualization.countDocuments({ createdBy: userId }),
    DataSource.countDocuments({ createdBy: userId }),
    Export.countDocuments({ userId }),
  ]);

  // Aggregate visualizations created over time (last 30 days for example)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const visualizationsOverTimeRaw = await Visualization.aggregate([
    { $match: { createdBy: userId, createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Format aggregation output
  const visualizationsOverTime = visualizationsOverTimeRaw.map(item => ({
    date: item._id,
    count: item.count,
  }));

  const accountAge = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)); // Days since account creation
  const lastUpdated = user.updatedAt; // Last profile update timestamp

  return res.status(200).json(
    new ApiResponse(200, {
      user,
      accountAge,
      lastUpdated,
      visualizationsCount,
      datasetsCount,
      exportsCount,
      visualizationsOverTime,  // <== Add this here
    }, "User dashboard data fetched successfully")
  );
});




const adminDashboard = asyncHandler(async (req, res) => {
    const [totalUsers, userCount, adminCount, newUsersLastWeek, recentUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: { $in: ["admin", "super-admin"] } }),
    User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
    User.find({}).sort({ updatedAt: -1 }).limit(5).select("-password -refreshtoken"),
  ]);

   
    return res.status(200).json(
        new ApiResponse(200, {
            totalUsers,
            userCount,
            adminCount,
            newUsersLastWeek,
            recentUsers
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