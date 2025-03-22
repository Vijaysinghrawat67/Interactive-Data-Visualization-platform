import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {config} from './config/env.js';
import userRouter from './routs/user.route.js';



const app = express();

app.use(cors({
    origin : config.origin,
    credentials : true
}));
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({ extended: true,
    limit: '16kb'
 }));
 app.use(express.static('public'));
app.use(cookieParser());


//route declaration
app.use('/api/v1/user', userRouter);



export {app};
