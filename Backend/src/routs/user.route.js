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

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)

userRouter.route('/logout').post(veryfyJWT, logOutUser)
userRouter.route('/change-password').put(veryfyJWT, changePassword)
userRouter.route('update-profile').put(veryfyJWT, upload.single('profileImage'), updateUerInfo)
userRouter.route('/me').get(veryfyJWT, getCurrentUser)



export default userRouter;