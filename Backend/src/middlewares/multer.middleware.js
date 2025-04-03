import multer from 'multer';
import fs from 'fs';
import path from 'path';


const tempDir = './public/temp';

if(!fs.existsSync(tempDir)){
    fs.mkdirSync(tempDir, {
        recursive : true
    })
}


const storage = multer.diskStorage({
    destination : function(req, res, cb){
        cb(null, tempDir)
    },
    filename :  function(req,file, cb){
        const ext = path.extname(file.originalname)
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`
        cb(null, filename)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedtypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const dataTypes =  ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/json"]

     if (req.path.includes("profile")) {
        // Profile image upload
        if (allowedtypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files (JPG, PNG, WEBP) are allowed"), false);
        }
    } else if (req.path.includes("upload")) {
        // File data upload
        if (dataTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only CSV, Excel, or JSON files are allowed"), false);
        }
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

export const upload = multer({
    storage,
    fileFilter
});