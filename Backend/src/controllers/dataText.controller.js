import { parseCSV, parseExcel } from '../utils/csvParser.js';
import { DataSource } from '../models/dataSource.model.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { analyzerText } from '../utils/textAnalyzer.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import mongoose from 'mongoose';
import { logActivity } from '../utils/logActivity.js';

const uploadfileData = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      throw new ApiError('file not found', 400);
    }
    const { name } = req.body;
    if (!name) {
      throw new ApiError("Name is required for the data sources", 400)
    }

    const fileExt = path.extname(req.file.originalname).toLowerCase();

    if (!fs.existsSync(req.file.path)) {
      throw new ApiError(400, 'File path is invalid or inaccessible');
    }

    let parseData;
    if (fileExt === '.csv') {
      parseData = await parseCSV(req.file.path);
    } else if (fileExt === '.xlsx') {
      parseData = await parseExcel(req.file.path);
    } else {
      throw new ApiError(400, "Invalid file type. Supported types are: csv, xlsx");
    }

    const schema = Array.isArray(parseData) && parseData.length > 0
      ? Object.keys(parseData[0]).map(key => key.trim().replace(/^\uFEFF/, ''))
      : [];

    if (!Array.isArray(schema) || schema.length === 0) {
      throw new ApiError(500, "Invalid schema extracted from file");
    }

    //console.log("Parsed Data: ", parseData);
    // console.log("Schema fields:", schema);

    const newDataObj = {
      userId: req.user?._id,
      name,
      sourceType: fileExt === '.csv' ? 'csv' : 'xlsx',
      sourceDetails: {
        filePath: req.file?.path,
      },
      schemaFields: schema, // ✅ renamed
      data: parseData,
      status: 'pending',
    };

    //console.log("Final payload before create():", JSON.stringify(newDataObj, null, 2));
    //console.log("DataSource schema paths:", Object.keys(DataSource.schema.paths));

    const newData = await DataSource.create(newDataObj);

    await logActivity({
  userId: req.user._id,
  actiontype: "create",
  title: `Uploaded CSV/XLSX data source: ${name}`,
  meta: {
  
    sourceType: 'file',
    fileExtension: fileExt,
    schemaFields: schema.slice(0, 6) // keep it concise
  }
});



    return res.status(200).json(
      new ApiResponse(201, newData, "file uploaded successfully")
    );

  } catch (error) {
    //console.error("detailed error:", error);
    if (req.file?.path) fs.unlinkSync(req.file.path);
    throw new ApiError(500, "error processing file. Please try again");
  }
});




const uploadApiData = asyncHandler(async (req, res) => {
  const { apiUrl, name } = req.body;

  if (!apiUrl && !name) {
    throw new ApiError(400, "API URL and Name is required");
  }


  let response;
  try {
    response = await axios.get(apiUrl);
  } catch (err) {
    console.error("Failed to fetch API data:", err.message);
    throw new ApiError(500, "Failed to fetch API data");
  }

  const apiData = response?.data;
  if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
    throw new ApiError(500, "Failed to fetch valid API data");
  }

  const dataArray = Array.isArray(apiData) ? apiData : [apiData];

  if (!dataArray.length) {
    throw new ApiError(400, "API returned empty data");
  }


  const schema = Object.keys(dataArray[0]);
  if (!schema || schema.length === 0) {
    throw new ApiError(500, "Inconsistant or empty schema for api response");
  }

  const newData = new DataSource({
    userId: req.user._id,
    name,
    sourceType: 'api',
    sourceDetails: {
      url: apiUrl
    },
    schemaFields: schema,
    data: dataArray, // ✅ important!
    status: 'pending'
  });

  await newData.save();

  await logActivity({
  userId: req.user._id,
  actiontype: "create",
  title: `Uploaded API data source: ${name}`,
  meta: {
    name,
    sourceType: 'api',
    url: apiUrl,
    schemaFields: schema
  }
});



  return res.status(201).json(
    new ApiResponse(201, newData, "API data processed successfully")
  );
});


const uploadTextData = asyncHandler(async (req, res) => {
  const { text, name } = req.body;

  // Validate input
  if (!text || typeof text !== "string") {
    throw new ApiError(
      400,
      "Invalid input: Text is required and must be a non-empty string."
    );
  }

  if (!name || typeof name !== "string") {
    throw new ApiError(
      400,
      "Invalid input: Name is required and must be a non-empty string."
    );
  }

  // Analyze the text
  const analysisResult = analyzerText(text);

  const newTextData = new DataSource({
    userId: req.user._id,
    name,
    sourceType: "text",
    schemaFields: Object.keys(analysisResult),
    data: [analysisResult], // Save the structured analysis result
    status: "pending",
  });

  await newTextData.save();

 await logActivity({
  userId: req.user._id,
  actiontype: "create",
  title: `Analyzed and uploaded text data: ${name}`,
  meta: {
    sourceType: 'text',
    schemaFields: Object.keys(analysisResult).slice(0, 6)
  }
});



  return res.status(201).json(
    new ApiResponse(201, newTextData, "Text data processed successfully")
  );
});


const getAllDataSources = asyncHandler(async (req, res) => {
  const uderId = req.user._id;
  //console.log(uderId);

  const dataSources = await DataSource.find({ userId: uderId }).sort({ createdAt: -1 });
  //console.log("response datasoource", dataSources);
  return res.status(200).json(
    new ApiResponse(200, dataSources, "Data sources fetched successfully"))
});


const getSingleDataSource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid data source ID." });
  }

  try {
    const dataSource = await DataSource.findById(id);

    if (!dataSource) {
      return res.status(404).json({ error: "Data source not found." });
    }
    //debug
    //console.log("fetched data source:", dataSource);

    res.status(200).json({
      data: {
        name: dataSource.name,
        fields: dataSource.schemaFields,
        fulldata: dataSource.data,
        createdAt: dataSource.createdAt,
        sourceType: dataSource.sourceType
      }
    });

  } catch (err) {
    console.error("Error fetching data source:", err);
    res.status(500).json({ error: "Server error while retrieving data source." });
  }

});



const getDataSourceScheam = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const dataSource = await DataSource.findById(id);

  if (!dataSource) {
    throw new ApiError(404, "Data source not found");
  }

  const schemaFields = dataSource.schemaFields;
  if (!schemaFields || schemaFields.length === 0) {
    throw new ApiError(400, "Data source schema is not available");
  }

  return res.status(200).json(new ApiResponse(200,
    { schema: schemaFields, sampleData: dataSource.data }, "Schema fetched successfully"));
})


const deleteDataSource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the data source by ID and user
  const dataSource = await DataSource.findOne({ _id: id, userId: req.user._id });

  if (!dataSource) {
    throw new ApiError(404, "Data source not found or you're not authorized to delete it");
  }

  // Delete local file if it exists (for file-based sources only)
  if (['csv', 'xlsx'].includes(dataSource.sourceType)) {
    const filePath = dataSource?.sourceDetails?.filePath;
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  // Delete the record from the database
  await DataSource.deleteOne({ _id: id });

  // Log the deletion activity
  await logActivity({
    userId: req.user._id,
    actiontype: "delete",
   title: `Deleted data source: ${dataSource.name}`,
    meta: {
      sourceType: dataSource.sourceType,
      sourceId: dataSource._id
    }
  });

  return res.status(200).json(
    new ApiResponse(200, null, "Data source deleted successfully")
  );
});


export {
  uploadfileData,
  uploadApiData,
  uploadTextData,
  getAllDataSources,
  getSingleDataSource,
  getDataSourceScheam,
  deleteDataSource
}