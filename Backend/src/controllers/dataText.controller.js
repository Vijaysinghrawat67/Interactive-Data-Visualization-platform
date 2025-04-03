import {parseCSV} from '../utils/csvParser.js';
import {DataSources} from '../models/dataSource.model.js';
import {asyncHandler} from '../utils/AsyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {analyzerText} from '../utils/textAnalyzer.js'
import fs from 'fs';
import path from 'path';


const uploadfileData = asyncHandler(async(req, res) => {
    try {
        if(!req.file) {
            throw new ApiError('file not found',400);
        }

        const fileExt = path.extname(req.file.originalname).toLowerCase();
        let parseData, schema;

        if(fileExt === '.csv'){
             parseData = await parseCSV(req.file.path);
            schema = parseData.length ? Object.keys(parseData[0]) : [];
        } else {
            throw new ApiError(400, "Unsupported file type. Only CSV files are allowed.");
        }

        
        const newData = new DataSources.create(
            {
                userId : req.user._id,
                sourceType : 'csv',
                filePath : req.file.path,
                schema
            });
     
        await newData.save();
       
        return res.status(200)
        .json( 
            new ApiResponse(201, newData, "file uploaded successfully"))
    } catch (error) {
        fs.unlinkSync(req.file.path);
        throw new ApiError(500, "error processing file. Please try again");
    }
});

const uploadApiData = asyncHandler(async(req, res) => {
    const {apiUrl} =  req.body;
    if(!apiUrl){
        throw new ApiError(400, "API URL is required");
    }

    const apiData = req.apiData;
    if(!apiData){
        throw new ApiError(500, "Failed to fetch API data");
    }

    const schema = Object.keys(apiData[0] || {} );

    const newData = new DataSources({
        userId : req.user._id,
        sourceType : 'api',
        sourcePath : apiUrl,
        schema
    })

    await newData.save();
    return res.status(201)
    .json(
        new ApiResponse(201, newData, "API data processed successfully")
    )
});


const uploadTextData = asyncHandler(async(req, res) => {
    const {text} = req.body;
    if(!text){
        throw new ApiError(400, "Text input is required");
    }

    const analysisResult = analyzerText(req.body.text);
    const newTextData = new DataSources(
        {   
            userId : req.user._id,
            sourceType : 'text',
            schema : Object.keys(analysisResult),
        }
    );
    await newTextData.save();

    return res.status(201)
    .json(
        new ApiResponse(201, newTextData, "Text data processed successfully")

    )
});


export{
    uploadfileData,
    uploadApiData,
    uploadTextData
}