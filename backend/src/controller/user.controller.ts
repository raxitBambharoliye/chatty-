import { compare, hash } from "bcrypt";
import { MQ } from "../common";
import { MODEL } from "../constant";
import logger from "../utility/logger";
import jwt from "jsonwebtoken";
import { createToken, decryptData, encryptData, setCookieData } from "../utility/common";
import { UserIN } from "../utility/interfaces";
import path from 'path';  
import fs from 'fs';
import handlebars from 'handlebars'
import { sendMail } from "../services/sendmail.service";
const registerUser = async (req: any, res: any) => {
  try {
    req.body.password = await hash(req.body.password, 10);
    const user = await MQ.insertOne<UserIN>(MODEL.USER_MODEL, req.body);
    if (user) {
      let token = createToken(user.id, user.email);
      if (token) {
        // delete user.password;
        return res.status(200).json({
          message: "user logged in successfully",
          userData: user,
          token,
        });
      }
    } else {
      res.status(500).json({
        message: "some thing went wrong, please try later",
      });
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN registerUser  :: ${error}`);
    console.log("CATCH ERROR IN registerUser  :: ", error);
  }
};

const userLogIn = async (req: any, res: any) => {
  try {
    let { email, password } = req.body;
    let user = await MQ.findOne<UserIN>(MODEL.USER_MODEL, { email: email });
    if (!user) {
      return res.status(400).json({
        message: "invalid email address or password",
      });
    }
    if (!(await compare(password, user.password))) {
      return res.status(400).json({
        message: "invalid email address or password",
      });
    }
    await MQ.findByIdAndUpdate(MODEL.USER_MODEL, user.id, { isOnLine: true });
    let secret = process.env.JWT_SECRET || "";
    let token = jwt.sign({ userId: user.id, email: user.email }, secret, {
      expiresIn: 60 * 60 * 24,
    });
    if (token) {
      // delete user.password;
      return res.status(200).json({
        message: "user logged in successfully",
        userData: user,
        token,
      });
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN logIn :: ${error}`);
    console.log("error", error);
  }
};


const loginWithGoogleHandler = async (req: any, res: any) => {
  try {
/* 
// This function is called after successful authentication
{
  sub: '113352132353108516881',
  name: 'raxit dev',
  given_name: 'raxit',
  family_name: 'dev',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocIGBlkYdHFoLb7PxRVcMwD9nHriOECEeZivVcQJA_8JMgj4PQ=s96-c',
  email: 'raxitdev55@gmail.com',
  email_verified: true
} */
    let userData = req.user._json;
    if (userData && userData.email_verified) {
      let user = await MQ.findOne<UserIN>(MODEL.USER_MODEL, {email: userData.email});
      if (!user) {
        const insertData = {
          userName: userData.name,
          email: userData.email,
          profilePicture: userData.picture,
          withEmail: true,
        };
        user = await MQ.insertOne(MODEL.USER_MODEL, insertData);
      }
      if (!user) {
        return res.status(500).json({
          message: "some thing went wrong, please try later",
        });
      }
      if (!user.verifiedEmail) {
        //NOTE - send verification email
        
      }
      let token = createToken(user.id, user.email);
      res.cookie("userData", JSON.stringify(setCookieData(user)));
      res.cookie("userToken", JSON.stringify(setCookieData(token)));
      res.redirect(`${process.env.CLIENT_URL}`);
    } else {
        res.redirect(`${process.env.CLIENT_URL}`);
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN :: loginWithGoogleHandler ::: ${error}`);
    console.log("error", error);
  }
};




export const sendVerificationMail =async (req: any, res: any) => {
  try {
    const { email, password, userName, DOB } = req.body;

    let html="";
    let source="";
    const filePath = path.join(__dirname, '../view/verifyEmail.html');
    const enCryptData= encryptData({email,password,userName,DOB},true);
    if (fs.existsSync(filePath)) {
      source = await fs.readFileSync(filePath, 'utf8').toString();
      const template = await handlebars.compile(source);
      html = template({ url: `https://chatty-pie-host.loca.lt/user/verifyEmail?data=${enCryptData}`, });
      
    }
    let mailResponsive:Boolean =await sendMail(html, "Email Verification")
    if (mailResponsive) {
    return  res.status(200).json({ success: true, message: "verification email sent successfully" });
    } else {
      return res.status(500).json({ success: false, message: "Failed to send verification email. please try after some time." });
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN sendVerificationMail ::: ${error}`);
    console.log('error', error)

  }
}

export const verifyEmail = async (req: any, res: any) => {
  try {
    let encryptedData:string = req.query.data;
    if (!encryptedData) { 
     return res.status(400).json({ success: false, message: "something went wrong" });
    }
    let decryptedData = decryptData(encryptedData);
    if (decryptedData && decryptedData.email && decryptedData.password && decryptedData.userName && decryptedData.DOB) {
      let { email, password, userName, DOB } = decryptedData;
      let checkUser = await MQ.find<UserIN[]>(MODEL.USER_MODEL, { $or:[{email:email},{userName:userName} ]});
      if (checkUser && checkUser.length) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }
      
      password= await hash(password, 10);
      let insertData = {
        userName,
        email,
        DOB,
        password
      }


     const user = await MQ.insertOne<UserIN>(MODEL.USER_MODEL, insertData);
      if (user) {
        res.sendFile(path.join(__dirname,'../view/emailVerified.html'))
      } else {  
        res.status(500).json({
          message: "some thing went wrong, please try later",
        });
      }
    } else {   
     return res.status(400).json({ success: false, message: "something went wrong" });
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN verifyEmail :::  ${error}`);
    console.log('error', error)
    
  }
}
export { registerUser, userLogIn, loginWithGoogleHandler };
