import {ActivityLog} from '../models/activityLog.model.js';
//import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/AsyncHandler.js';



const getActivityLog = asyncHandler(async(req, res) => {
    const {role, _id: userId} = req.user;
    const {visualizationId} =  req.query;

    const filter = role === "admin" || role === "super-admin" ? {} : {userId};

    if(visualizationId){
        filter.visualizationId = visualizationId;
    }

    const logs = await ActivityLog.find(filter)
    .populate("userId", "name email")
    .populate("visualizationId", "title")
    .sort({createdAt : -1});


    return res.status(200)
    .json(
        new ApiResponse(200, logs, "Activity log fetched successfully")
    );
});

export {
    getActivityLog
}