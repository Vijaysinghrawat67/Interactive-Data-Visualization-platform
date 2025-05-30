import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { DataSource } from '../models/dataSource.model.js';
import { Visualization } from '../models/visualization.model.js';
import { User } from '../models/user.model.js';
import { logActivity } from '../utils/logActivity.js';




// create visualization
const createVisualization = asyncHandler(async (req, res) => {
    const { title, description, chartType, xField, yField, config, datasourceId } = req.body;
    //console.log("Request body:", req.body);
    //console.log("User ID:", req.user._id);
    //console.log("Datasource ID:", datasourceId);

    if (!title || !chartType || !xField || !yField || !datasourceId) {
        throw new ApiError(
            400, "All required filed must be provided"
        )
    }

    const dataSource = await DataSource.findById(datasourceId);
    if (!dataSource) {
        throw new ApiError(
            404, "Data source not found"
        )
    }

    const visualization = await Visualization.create({
        userId: req.user._id,
        title,
        description,
        chartType,
        xField,
        yField,
        config,
        datasourceId
    });

    await logActivity({
        userId: req.user._id,
        actiontype: "create",
        title: `Visualization "${visualization.title}" created`,
        meta: {
            chartType: visualization.chartType,
            description: visualization.description,

        }
    });


    return res.status(201)
        .json(new ApiResponse(
            201, visualization, "Visualization created successfully"
        ));
});



const getUserVisualization = asyncHandler(async (req, res) => {
    const visualizations = await Visualization.find({
        userId: req.user._id
    })
        .populate('datasourceId', 'sourceType schema')
        .sort({ createdAt: -1 });


    return res.status(200)
        .json(new ApiResponse(
            200, visualizations
        ));
});


const getSingleVisualization = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const visualization = await Visualization.findOne({
        _id: id,
        userId: req.user._id,
    }).populate('datasourceId', 'sourceType schema data');

    if (!visualization) {
        throw new ApiError(
            404, "Visualization not found"
        )
    }

    return res.status(200)
        .json(new ApiResponse(
            200, visualization
        ))
});


const updateVisualization = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existing = await Visualization.findOne({ _id: id, userId: req.user._id });

    if (!existing) {
        throw new ApiError(404, "Visualization not found or not authorized");
    }

    const update = await Visualization.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { $set: req.body },
        { new: true }
    );

    if (!update) {
        throw new ApiError(404, "visualizaton not found or not authorized")
    }

    const changedFields = {};
    for (const key of Object.keys(req.body)) {
        if (req.body[key] !== existing[key]) {
            changedFields[key] = {
                old: existing[key],
                new: req.body[key]
            };
        }
    }

    await logActivity({
        userId: req.user._id,
        actiontype: "update",
        title: `Updated visualization "${existing.title}"`,
        meta: {
            visualizationId: id,
            changedFields
        }
    });

    res.status(200)
        .json(new ApiResponse(
            200, update, "Visualization updated successfully"
        ))
});


const deleteVisualization = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existing = await Visualization.findOne({ _id: id, });

    if (!existing) {
        throw new ApiError(404, "Visualization not found or not authorized");
    }

    const deleted = await Visualization.findOneAndDelete({
        _id: id,
        userId: req.user._id
    });

    if (!deleted) {
        throw new ApiError(404, "Visualization not found or not authorized")
    }

    await logActivity({
        userId: req.user._id,
        actiontype: "delete",
        title: `Visualization "${visualization.title}" deleted`,
        meta: {
            deletedAt: new Date().toISOString(),

        }
    });


    return res.status(200)
        .json(new ApiResponse(
            200, null, "Visualization deleted successfully"
        ));
});




const iviteCollaborator = asyncHandler(async (req, res) => {
    const { id } = req.params; // visualization ID
    const { email } = req.body; // collaborator email
    const requestorId = req.user._id;

    // Find the user you're trying to invite by email
    //console.log("Trying to invite user with email:", email);

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
        throw new ApiError(404, "User to invite not found");
    }

    // Find the visualization
    const viz = await Visualization.findById(id);
    if (!viz) {
        throw new ApiError(404, "Visualization not found");
    }

    // Ensure the requester is the owner
    if (viz.userId.toString() !== requestorId.toString()) {
        throw new ApiError(403, "You are not authorized to invite collaborators");
    }

    // Avoid duplicate collaborator
    if (viz.collaborators?.includes(userToInvite._id)) {
        throw new ApiError(400, "User is already a collaborator");
    }

    // Push collaborator and save
    viz.collaborators = [...(viz.collaborators || []), userToInvite._id];
    await viz.save();


    await logActivity({
        userId: req.user._id,
        actiontype: "share",
        visualizationId: id,
        meta: { invitedUser: email }
    });


    return res
        .status(200)
        .json(new ApiResponse(200, null, "User invited successfully"));
});



const getSharedVisualizations = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const sharedVisualizations = await Visualization.find({
        collaborators: userId,

    }).populate('userId', 'name email');

    return res.status(200)
        .json(new ApiResponse(
            200, sharedVisualizations, "Shared visualizations fetched successfully"
        ))
});





export {
    createVisualization,
    getUserVisualization,
    getSingleVisualization,
    updateVisualization,
    deleteVisualization,
    iviteCollaborator,
    getSharedVisualizations,

}