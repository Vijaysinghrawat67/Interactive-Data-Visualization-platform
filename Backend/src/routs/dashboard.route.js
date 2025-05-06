import {Router} from 'express';
import {veryfyJWT} from '../middlewares/auth.middleware.js';
import {authorizeRoles} from '../middlewares/authRole.middleare.js';
import { adminDashboard, myDashboard, saveDashboard, userDashboard } from '../controllers/dashboard.controller.js';


const dashboardrouter = Router();

dashboardrouter.route('/user-das').get(veryfyJWT, userDashboard)
dashboardrouter.route('/admin-das').get(veryfyJWT, authorizeRoles('admin', 'super-admin'), adminDashboard)
dashboardrouter.route('/my-dashboard').get(veryfyJWT, myDashboard)
dashboardrouter.route('/save').post(veryfyJWT, saveDashboard)

export default dashboardrouter;