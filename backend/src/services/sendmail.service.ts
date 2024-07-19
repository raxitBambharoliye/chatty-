import logger from "../utility/logger";
import nodemailer from 'nodemailer';
import fs from 'fs';    
import path from 'path';  
import handlebars from 'handlebars';

export const sendMail = async (data="",subject:string):Promise <Boolean> => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'radhe.developer666@gmail.com',
                pass: 'zwmkllrjhougtlfc'
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

console.log("mail sending process start ")
        await transporter.sendMail({
            from: "radhe.developer666@gmail.com",
            to: "raxitdev55@gmail.com",
            subject:subject,
            html:data
        });
console.log("mail sending process end ")
        return true;
    } catch (error) {
        logger.error(`CATCH ERROR IN ::: sendMail :: 📧📧📧 :: ${error}`);
        console.log('error', error);
        return false;
    }
};