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
    if(allowedtypes.includes(file.mimetype)){
        cb(null,true)
    } else{
        cb(new Error('only images are allowed'), false);
    }
};

export const upload = multer({
    storage,
    fileFilter
});