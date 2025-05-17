import { Router } from 'express';
import { createExport, downloadExport, listExports, deleteExport } from '../controllers/export.controller.js';
import { veryfyJWT } from '../middlewares/auth.middleware.js';

const exportRoute = Router();


exportRoute.get('/list', veryfyJWT, listExports);

exportRoute.post('/save', veryfyJWT, createExport);


exportRoute.get('/download/:fileName', downloadExport);

exportRoute.delete('/delete/:exportId', veryfyJWT, deleteExport);

export default exportRoute;
