import {Export} from '../models/export.model.js';
import {Visualization} from '../models/visualization.model.js';
import {exportChartAsFile, exportDataFile} from '../utils/exportUtil.js';
import {v4 as uuidv4} from 'uuid';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/AsyncHandler.js';
import fs from 'fs';
import path from 'path';




const createExport = asyncHandler(async (req, res) => {
    try {
      const { exportFormat, visualizationIds, title, description, layout } = req.body;
      const userId = req.user._id;
  
      const validFormats = ['png', 'pdf', 'csv', 'json'];
      if (!validFormats.includes(exportFormat)) {
        throw new ApiError(400, 'Invalid export format');
      }
  
      const visualizations = await Visualization.find({ _id: { $in: visualizationIds }, userId })
        .populate('datasourceId');
  
      if (!visualizations.length) {
        throw new ApiError(404, 'No visualizations found or unauthorized');
      }
  
      const fileName = `${uuidv4()}_${title?.replace(/\s+/g, '_') || 'export'}`;
      let filePath;
  
      if (['png', 'pdf'].includes(exportFormat)) {
        const htmlContent = `
          <html>
          <body>
            <h1>${title || 'Untitled Export'}</h1>
            <p>${description || ''}</p>
            ${visualizations.map(viz => `
              <div style="margin-bottom: 20px;">
                <h3>${viz.title}</h3>
                <div id="chart">${JSON.stringify(viz.config)}</div>
              </div>
            `).join('')}
          </body>
          </html>
        `;
  
        filePath = await exportChartAsFile(htmlContent, exportFormat, fileName);
      } else {
        // Merge data from all visualizations
        const mergedData = visualizations.flatMap(viz => viz.datasourceId.data);
        filePath = exportDataFile(mergedData, exportFormat, fileName);
      }
  
      const downloadLink = `/api/v1/exports/download/${fileName}.${exportFormat}`;
  
      const exportRecord = await Export.create({
        userId,
        visualizations: visualizationIds,
        title,
        description,
        layout,
        exportFormat,
        downloadLink,
      });
  
      return res.status(201).json(
        new ApiResponse(201, downloadLink, { exportId: exportRecord._id }, "Export created successfully")
      );
    } catch (error) {
      //console.error("❌ Export creation error:", error);
      throw new ApiError(500, "Server error during export creation");
    }
  });
  


  const listExports = asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
  
      const exports = await Export.find({ userId }).sort({ createdAt: -1 });
      
      return res.status(200).json(
        new ApiResponse(200, exports, "Export records fetched successfully")
      );
    } catch (error) {
      throw new ApiError(500, "Server error during fetching export records");
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