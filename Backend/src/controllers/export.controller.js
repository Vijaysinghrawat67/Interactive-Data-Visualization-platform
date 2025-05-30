import { Export } from '../models/export.model.js';
import { Visualization } from '../models/visualization.model.js';
import { exportChartAsFile, exportDataFile } from '../utils/exportUtil.js';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import fs from 'fs';
import path from 'path';
import { logActivity } from '../utils/logActivity.js'


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
      // Compose HTML for puppeteer to render
      const htmlContent = `
          <html>
            <head>
              <title>${title}</title>
              <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
              <style>
                body { font-family: sans-serif; padding: 20px; background: white; }
                h1 { font-size: 24px; margin-bottom: 10px; }
                h3 { margin-top: 30px; margin-bottom: 10px; }
                canvas { margin-bottom: 40px; }
                p { margin-bottom: 30px; }
              </style>
            </head>
            <body>
              <h1>${title}</h1>
              <p>${description}</p>
              ${visualizations.map((viz, index) => `
                <div>
                  <h3>${viz.title}</h3>
                  <canvas id="chart-${index}" width="600" height="400"></canvas>
                  <p><strong>X Field:</strong> ${viz.xField || 'N/A'}<br/>
                    <strong>Y Field:</strong> ${viz.yField || 'N/A'}</p>
                  <p>${viz.description || 'No description available'}</p>
                </div>
              `).join('')}
              <script>
                document.addEventListener('DOMContentLoaded', function () {
                  Promise.all([
                    ${visualizations.map((viz, index) => `
                      new Promise(resolve => {
                        const ctx = document.getElementById('chart-${index}').getContext('2d');
                        const chart = new Chart(ctx, {
                          type: "${viz.chartType || 'bar'}",
                          data: ${JSON.stringify(viz.datasourceId?.data || {})},
                          options: {
                            ...${JSON.stringify(viz.config?.options || {})},
                            animation: {
                              onComplete: resolve
                            }
                          }
                        });
                      })
                    `).join(',')}
                  ]).then(() => {
                    window.chartsRendered = true;
                  });
                });
              </script>
            </body>
          </html>
        `;

      filePath = await exportChartAsFile(htmlContent, exportFormat, fileName);
    } else {
      // CSV or JSON export
      const mergedData = visualizations.flatMap(viz => viz.datasourceId.data || []);
      filePath = exportDataFile(mergedData, exportFormat, fileName);
    }

    const downloadLink = `/api/v1/exports/download/${fileName}.${exportFormat}`;

    const exportRecord = await Export.create({
      userId,
      visualizations: visualizations.map((viz) => ({
        _id: viz._id,
        chartType: viz.chartType,
        title: viz.title,
        xField: viz.xField,
        yField: viz.yField,
        config: viz.config,
        data: viz.datasourceId?.data || [],
      })),
      title,
      description,
      layout,
      exportFormat,
      downloadLink,
    });

     await logActivity({
      userId,
      actiontype: "export_create",
      title: `Created export "${title}" with ${visualizations.length} visualization(s)`,
      meta: {
        exportId: exportRecord._id.toString(),
        exportTitle: title || null,
        exportFormat,
        visualizationCount: visualizations.length,
        visualizationIds: visualizations.map(v => v._id.toString()),
      },
    });



    return res.status(201).json(
      new ApiResponse(201, downloadLink, { exportId: exportRecord._id }, "Export created successfully")
    );
  } catch (error) {
    console.error("❌ Export creation error:", error);
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

const downloadExport = asyncHandler(async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = path.resolve('exports', fileName);

    if (!fs.existsSync(filePath)) {
      throw new ApiError(404, "File not found");
    }

    res.download(filePath);

    await logActivity({
      userId: req.user._id,
      actiontype: "export_download",
      title: `Downloaded export file: ${fileName}`,
      meta: {
        exportFileName: fileName,
      },
    });


  } catch (error) {
    throw new ApiError(500, "Server error during downloading export file");
  }
});

const deleteExport = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { exportId } = req.params;

    const exportRecord = await Export.findById(exportId);
    if (!exportRecord) {
      throw new ApiError(404, "Export not found");
    }

    const downloadLink = exportRecord.downloadLink;
    const fileName = downloadLink.split('/').pop();

    const filePath = path.resolve('exports', fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }


    await Export.findByIdAndDelete(exportId);

    
    await logActivity({
      userId,
      actiontype: "export_delete",
      title: `Deleted export with ID: ${exportId} and file: ${fileName}`,
      meta: {
        exportId: exportId.toString(),
        exportFileName: fileName,
      },
    });



    return res.status(200)
      .json(
        new ApiResponse(200, null, "Export deleted successfully")
      )


  } catch (error) {
    // console.error("❌ Export deletion error:", error);
    throw new ApiError(500, "Server error during deleting export file");
  }
});

export {
  createExport,
  listExports,
  downloadExport,
  deleteExport
};
