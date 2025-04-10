import {Router} from 'express';
import {getActivityLog} from '../controllers/activity.controller.js';
import {veryfyJWT} from '../middlewares/auth.middleware.js';


const activity = Router();


activity.use(veryfyJWT);
activity.route('/').get(getActivityLog);



export default activity;