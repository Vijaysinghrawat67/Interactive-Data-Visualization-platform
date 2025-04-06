import {asyncHandler} from '../utils/AsyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {DataSource} from '../models/dataSource.model.js';
import {Visualization} from '../models/visualization.model.js';



// create visualization
const createVisualization = asyncHandler(async(req, res) => {
    const {title, description, chartType, xField, yField, config, datasourceId} = req.body;

    if(!title || !chartType || !xField || !yField || !datasourceId){
        throw new ApiError(
            400, "All required filed must be provided"
        )
    }

    const dataSource = await DataSource.findById(datasourceId);
    if(!dataSource){
        throw new ApiError(
            404, "Data source not found"
        )
    }

    const visualization = await Visualization.create({
        userId : req.user._id,
        title,
        description,
        chartType,
        xField,
        yField,
        config,
        datasourceId
    });

    return res.status(201)
    .json(  new ApiResponse(
        201, visualization, "Visualization created successfully"
     ));
});



const getUserVisualization = asyncHandler(async(req, res) => {
    const visualizations = await Visualization.find({
        userId : req.user._id
    })
    .populate('datasourceId', 'sourceType schema')
    .sort({createdAt : -1});


    return res.status(200)
    .json( new ApiResponse(
        200, visualizations
    ));
});


const getSingleVisualization = asyncHandler(async(req, res) => {
    const {id} = req.params;

    const visualization = await Visualization.findOne({
        _id : id,
        userId : req.user._id,
    }).populate('datasourceId', 'sourceType schema' );

    if(!visualization){
        throw new ApiError(
            404, "Visualization not found"
        )
    }

    return res.status(200)
    .json(new ApiResponse(
        200, visualization
    ))
});


const updateVisualization = asyncHandler(async(req, res) => {
    const {id} = req.params;

    const update = await Visualization.findOneAndUpdate(
        {_id : id, userId : req.user._id},
        {$set : req.body},
        {new : true}
    );

    if(!update){
        throw new ApiError(404, "visualizaton not found or not authorized")
    }

    res.status(200)
    .json(new ApiResponse(
        200, update, "Visualization updated successfully"
    ))
});


const deleteVisualization = asyncHandler(async(req, res) => {
    const {id} = req.params;

    const deleted = await Visualization.findOneAndDelete({
        _id : id,
        userId: req.user._id
    });

    if(!deleted){
        throw new ApiError(404, "Visualization not found or not authorized")
    }

    return res.status(200)
    .json(new ApiResponse(
        200, null, "Visualization deleted successfully"
    ));
});


export{
    createVisualization,
    getUserVisualization,
    getSingleVisualization,
    updateVisualization,
    deleteVisualization
}