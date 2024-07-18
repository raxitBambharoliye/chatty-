import logger from "../utility/logger";
import nodemailer from 'nodemailer';
import fs from 'fs';    
export const sendMail = async () => {
    try {
        // const transporter = nodemailer.createTransport({
        //     host: "smtp.gmail.com",
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         user: 'radhe.developer666@gmail.com',
        //         pass: 'zwmkllrjhougtlfc'
        //     },
        //     tls: {
        //         rejectUnauthorized: false,
        //     },
        // });
        
        // await transporter.sendMail({
        //     from: "radhe.developer666@gmail.com",
        //     to: "raxitdev55@gmail.com",
        //     subject: "test",
        //     // html: "<h1>Hello</h1>"
        //     text: "hello world",
        // });
        
    } catch (error) {
        logger.error(`CATCH ERROR IN ::: sendMail :: 📧📧📧 :: ${error}`);
        console.log('error', error);
    }
};