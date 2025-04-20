import { Router } from 'express';
import {
    registerUser,
    loginUser,
    logOutUser,
    changePassword,
    updateUerInfo,
    getCurrentUser
} from '../controllers/auth.controller.js'

import {veryfyJWT} from '../middlewares/auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js';



const userRouter = Router()

userRouter.route('/register').post(upload.none(), registerUser)
userRouter.route('/login').post(loginUser)

userRouter.route('/logout').post(veryfyJWT, logOutUser)
userRouter.route('/change-password').put(veryfyJWT, changePassword)
userRouter.route('/update-profile').put(veryfyJWT, upload.single('profileImage'), updateUerInfo)
userRouter.route('/me').get(veryfyJWT, getCurrentUser)



export default userRouter;

import { Router } from "express";
import {authorizeRoles} from '../middlewares/authRole.middleare.js';
import {veryfyJWT} from '../middlewares/auth.middleware.js';
import { deleteUser, getAllUsers, getSingleUser, getuserStatus, updateeUserRole, registerAdmin } from '../controllers/admin.controller.js';


const adminRoute = Router();

adminRoute.use(veryfyJWT, authorizeRoles('admin','super-admin'));

adminRoute.route('/users').get(getAllUsers)
adminRoute.route('/users/:id').get(getSingleUser)
adminRoute.route('/users/:id/role').get(updateeUserRole)
adminRoute.route('/users/:id').delete(deleteUser)
adminRoute.route('/user-status').get(getuserStatus)
adminRoute.route('/register-admin').post(veryfyJWT, authorizeRoles('admin'), registerAdmin)



export default adminRoute;
import {Router} from 'express';
import {veryfyJWT} from '../middlewares/auth.middleware.js';
import {authorizeRoles} from '../middlewares/authRole.middleare.js';
import { adminDashboard, userDashboard } from '../controllers/dashboard.controller.js';


const dashboardrouter = Router();

dashboardrouter.route('/user-das').get(veryfyJWT, userDashboard)
dashboardrouter.route('/admin-das').get(veryfyJWT, authorizeRoles('admin', 'super-admin'), adminDashboard)

export default dashboardrouter;
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

import {Router} from 'express';
import{ createVisualization, deleteVisualization, getSingleVisualization, getUserVisualization, updateVisualization , iviteCollaborator,
    getSharedVisualizations} from '../controllers/visualization.controller.js';
import {veryfyJWT} from '../middlewares/auth.middleware.js';

const visualize = Router();
visualize.use(veryfyJWT);
visualize.route('/shared-with-me').get(getSharedVisualizations);

visualize.route('/').post(createVisualization);
visualize.route('/').get(getUserVisualization);
visualize.route('/:id').get(getSingleVisualization);
visualize.route('/:id').put(updateVisualization);
visualize.route('/:id').delete(deleteVisualization);
visualize.route('/:id/invite').post(iviteCollaborator);




export default visualize;   
import {Router} from 'express';
import {createExport, downloadExport, listExports} from '../controllers/export.controller.js';
import {veryfyJWT} from '../middlewares/auth.middleware.js';


const exportRoute = Router();


exportRoute.route('/:visualizationId').post(veryfyJWT, createExport);
exportRoute.route('/:visualizationId').get(veryfyJWT, listExports);
exportRoute.route('/download/:fileName').get(downloadExport);

export default exportRoute;
import {Router} from 'express';
import {getActivityLog} from '../controllers/activity.controller.js';
import {veryfyJWT} from '../middlewares/auth.middleware.js';


const activity = Router();


activity.use(veryfyJWT);
activity.route('/').get(getActivityLog);



export default activity;