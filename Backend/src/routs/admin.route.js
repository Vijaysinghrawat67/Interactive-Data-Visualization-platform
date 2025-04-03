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