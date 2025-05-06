import { Router } from 'express';
import { createExport, downloadExport, listExports } from '../controllers/export.controller.js';
import { veryfyJWT } from '../middlewares/auth.middleware.js';

const exportRoute = Router();


exportRoute.get('/list', veryfyJWT, listExports);

exportRoute.post('/save', veryfyJWT, createExport);


exportRoute.get('/download/:fileName', downloadExport);

export default exportRoute;
