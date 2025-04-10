import {Router} from 'express';
import {createExport, downloadExport, listExports} from '../controllers/export.controller.js';
import {veryfyJWT} from '../middlewares/auth.middleware.js';


const exportRoute = Router();


exportRoute.route('/:visualizationId').post(veryfyJWT, createExport);
exportRoute.route('/:visualizationId').get(veryfyJWT, listExports);
exportRoute.route('/download/:fileName').get(downloadExport);

export default exportRoute;