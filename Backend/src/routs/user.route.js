import {Router} from 'express';
import {
    registerUser,
   // loginUser,
   // logOutUser
} from '../controllers/auth.controller.js'



const userRouter = Router()

userRouter.route('/register').post(registerUser)
//router.route('/login').post(loginUser)





export default userRouter;