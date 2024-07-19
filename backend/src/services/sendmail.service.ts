import logger from "../utility/logger";
import nodemailer from 'nodemailer';
import fs from 'fs';    
import path from 'path';  
import handlebars from 'handlebars';

export const sendMail = async () => {
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
        
// html start 
let html="";
let source="";
const filePath = path.join(__dirname, '../view/verifyEmail.html');
    if (fs.existsSync(filePath)) {
       source = await fs.readFileSync(filePath, 'utf8').toString();
      const template = await handlebars.compile(source);
      let replace:any= {email:"test@gmail.com",userName:"test",password:"12322"}
      // replace = encryptData(replace);
      // console.log('replace', replace)
      html= template({email:"r@gmail.com"})
    }

//html end


console.log("mail sending process start ")
        await transporter.sendMail({
            from: "radhe.developer666@gmail.com",
            to: "raxitbambharoliya@gmail.com",
            subject: "test",
            html:source
            // text: "hello world",
        });
console.log("mail sending process end ")
        
    } catch (error) {
        logger.error(`CATCH ERROR IN ::: sendMail :: 📧📧📧 :: ${error}`);
        console.log('error', error);
    }
};