import {Export} from '../models/export.model.js';
import {Visualization} from '../models/visualization.model.js';
import {exportChartAsFile, exportDataFile} from '../utils/exportUtil.js';
import {v4 as uuidv4} from 'uuid';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/AsyncHandler.js';
import fs from 'fs';
import path from 'path';




const createExport = asyncHandler(async( req, res) => {
    try {
        const {exportFormat} = req.body;
        const {visualizationId} =  req.params;
        const userId = req.user._id;

        const validateFormats = ['png', 'pdf', 'csv', 'json'];
        if(!validateFormats.includes(exportFormat)){
            throw new ApiError(400, 'Invalid export format');
        }

        const visualization = await Visualization.findById(visualizationId)
        .populate('datasourceId');
        if(!visualization || visualization.userId.toString() !== userId.toString()){
            throw new ApiError(404, "Visualization not find or unauthorized")
        }


        const fileName = `${uuidv4()}_${visualization.title.replace(/\s+/g, '_')}`;
        let filePath;


        if(['png', 'pdf'].includes(exportFormat)){
            const html = `<html><body><h3>${visualization.title}
            </h3><div id="chart">${JSON.stringify(visualization.config)}</div></body></html>`;
            filePath = await exportChartAsFile(html, exportFormat, fileName);
        } else{
            const data = visualization.datasourceId.data;
            filePath = exportDataFile(data, exportFormat, fileName);
        }

        const downloadLink = `/api/v1/exports/download/${fileName}.${exportFormat}`;

        const exportRecord = await Export.create({
            userId,
            visualizationId,
            exportFormat,
            downloadLink
        });

        return res.status(201)
        .json(
            new ApiResponse(201, 
                downloadLink, {exportId : exportRecord._id}, 
                "Export successfullt"
    )
        )
    } catch (error) {
       // console.error('Export error', error);
        throw new ApiError(500, "server error during export")
    }
});


const listExports = asyncHandler(async(req, res) => {
    try {
        const {visualizationId} = req.params;
        const userId = req.user._id;

        const exports = await Export.find({userId, visualizationId})
        .sort({createdAt : -1});
        return res.status(200)
        .json(
            new ApiResponse(200, exports, "export record fetched successfully")
        )
    } catch (error) {
        throw new ApiError(500, "server error during fetching export records")
    }
});


const downloadExport = asyncHandler(async(req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.resolve('exports', fileName);

       // console.log("🪪 Requested file:", fileName);
       // console.log("📂 Resolved path:", filePath);

        if(!fs.existsSync(filePath)){
           // console.error("❌ File not found at:", filePath);
            throw new ApiError(404, "file not found")
        }

        res.download(filePath);

    } catch (error) {
        //console.error("🔥 Download error:", error);
        throw new ApiError(500, "server error during downloading export file")
    }
});


export {
    createExport,
    listExports,
    downloadExport
};