import nodemailer from "nodemailer";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import logger from "../logger";
import { encrypt } from "../utils/crypto.utils";
import Config from "../config";

export async function sendMail(email: string, subject: string, template_path: string) {
    try {

        const { HOST, EMAIL_USERNAME, EMAIL_PASSWORD, URI } = Config

        const transporter = nodemailer.createTransport({
            host: "gmail",
            pool: true,
            service: "gmail",
            port: 587,
            // secure: false,
            auth: {
                user: EMAIL_USERNAME,
                pass: EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
              },
        });
        logger.info("URI------------>", URI);
        const filePath = path.join(__dirname, template_path);
        const source = fs.readFileSync(filePath, "utf-8").toString();
        const template = handlebars.compile(source);
        let htmlToSend;
        if (subject == "Verify Email") {
            const encryptEmail = encrypt(email);
            const replacements = {
                email: encryptEmail,
                url: URI,
            };
            htmlToSend = template(replacements);
        } else {
            const replacements = {
                email: email,
                url: URI,
            };
            htmlToSend = template(replacements);
        }

        await transporter.sendMail({
            from: EMAIL_USERNAME,
            to: email,
            subject: subject,
            html: htmlToSend,
        });
        logger.info("email sent sucessfully");
    } catch (error) {
        logger.info("email not sent");
        logger.info(error);
    }
}

// export = sendMail;
