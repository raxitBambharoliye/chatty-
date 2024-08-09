import multer from 'multer'
import path from 'path';
import { UPLOAD_FOLDER } from '../constant';
const multerObj = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profileImage") {
            
            cb(null,path.join(__dirname,`..${UPLOAD_FOLDER.USER_PROFILE}`))
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Math.ceil(Math.random() * 9999999));
    }
})

export const uploadImage = multer({ storage: multerObj });