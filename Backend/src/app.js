import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {config} from './config/env.js';
import userRouter from './routs/user.route.js';
import adminRouter from './routs/admin.route.js';
import dashboardrouter from './routs/dashboard.route.js';
import Upload from './routs/upload.route.js';
import visualize from './routs/visualization.route.js';
import exportRoute from './routs/export.route.js';
import activity from './routs/activity.route.js';


const app = express();

app.use(cors({
    origin : config.origin,
    credentials : true
}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true,
    limit: '50mb',
 }));
 app.use(express.static('public'));
app.use(cookieParser());


//route declaration
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin',adminRouter );
app.use('/api/v1/dashboard', dashboardrouter);
app.use('/api/v1/upload', Upload);
app.use('/api/v1/visualization',visualize);
app.use('/api/v1/export', exportRoute);
app.use('/api/v1/activity', activity);

export {app};
