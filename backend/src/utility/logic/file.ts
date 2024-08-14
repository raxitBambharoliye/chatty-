import logger from "../logger"
import fs from 'fs';    
export const removeFile = (path: string) => {
    try {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
            return true;
        }
    } catch (err) { 
        logger.error(`CATCH ERROR IN removeFile ${err}`)
        console.log('err', err);
        return false;
    }

}