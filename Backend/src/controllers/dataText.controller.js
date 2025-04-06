import { parseCSV, parseExcel } from '../utils/csvParser.js';
import { DataSource } from '../models/dataSource.model.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {analyzerText} from '../utils/textAnalyzer.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const uploadfileData = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      throw new ApiError('file not found', 400);
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
      ? Object.keys(parseData[0]).filter(key => key && !key.startsWith('__EMPTY'))
      : [];

    if (!Array.isArray(schema) || schema.length === 0) {
      throw new ApiError(500, "Invalid schema extracted from file");
    }

    const newDataObj = {
      userId: req.user?._id,
      sourceType: fileExt === '.csv' ? 'csv' : 'xlsx',
      sourceDetails: {
        filePath: req.file?.path,
      },
      schemaFields: schema, // ✅ renamed
      data: [],
      status: 'pending',
    };

    //console.log("Final payload before create():", JSON.stringify(newDataObj, null, 2));
    //console.log("DataSource schema paths:", Object.keys(DataSource.schema.paths));

    const newData = await DataSource.create(newDataObj);

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
  const { apiUrl } = req.body;

  if (!apiUrl) {
      throw new ApiError(400, "API URL is required");
  }

  let response;
  try {
    response = await axios.get(apiUrl);
} catch (err) {
    console.error("Failed to fetch API data:", err.message);
    throw new ApiError(500, "Failed to fetch API data");
}

  const apiData = req.apiData;
  // if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
  //     throw new ApiError(500, "Failed to fetch valid API data");
  // }
  
  const dataArray = Array.isArray(apiData) ? apiData : [apiData];

    if (!dataArray.length) {
        throw new ApiError(400, "API returned empty data");
    }


  const schema = Object.keys(dataArray[0]);

  const newData = new DataSource({
      userId: req.user._id,
      sourceType: 'api',
      sourceDetails: {
          url: apiUrl
      },
      schema,
      data: dataArray, // ✅ important!
      status: 'pending'
  });

  await newData.save();

  return res.status(201).json(
      new ApiResponse(201, newData, "API data processed successfully")
  );
});


const uploadTextData = asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text) {
        throw new ApiError(400, "Text input is required");
    }

    const analysisResult = analyzerText(req.body.text);

     const newTextData = new DataSource({
        userId: req.user._id,
        sourceType: 'text',
        schema: Object.keys(analysisResult),
        data: [analysisResult], // 🔥 Save the actual analysis result
        status: 'pending'
    });

    await newTextData.save();

    return res.status(201)
        .json(
            new ApiResponse(201, newTextData, "Text data processed successfully")

        )
});


export {
    uploadfileData,
    uploadApiData,
    uploadTextData
}