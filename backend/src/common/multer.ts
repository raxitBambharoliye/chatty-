import multer from 'multer'
import path from 'path';
const multerObj = multer.diskStorage({
    destination:  (req, file, cb)=> {
        cb(null,path.join(__dirname,'../uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + '-' + Math.ceil(Math.random() * 9999999));
    }
})

export const uploadImage = multer({ storage: multerObj });