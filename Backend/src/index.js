import {app} from './app.js';
import connectDB from './db/db.js';
import {config} from './config/env.js';


connectDB()
.then(() => {
    app.listen(config.PORT, () =>{
        console.log(`server is running at PORT : ${config.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGODB connection failed!!!",  err);
})