import {Router} from "express";
import {upload} from '../middlewares/multer.middleware.js';
import {fetchDatafromApi} from '../middlewares/apiFetch.meddleware.js';
import {uploadfileData, uploadApiData,uploadTextData} from '../controllers/dataText.controller.js';
import {veryfyJWT} from '../middlewares/auth.middleware.js';


const Upload = Router();

Upload.route('/upload-file').post(veryfyJWT, upload.single('file'), uploadfileData);
Upload.route('/upload-api').post(veryfyJWT, fetchDatafromApi, uploadApiData);
Upload.route('/upload-text').post(veryfyJWT, uploadTextData);


export default Upload;