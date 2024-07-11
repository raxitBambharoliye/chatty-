import { compare, hash } from "bcrypt";
import { MQ } from "../common";
import { MODEL } from "../constant";
import logger from "../utility/logger";
import jwt from "jsonwebtoken";
import { createToken, setCookieData } from "../utility/common";
const registerUser = async (req: any, res: any) => {
  try {
    req.body.password = await hash(req.body.password, 10);
    const user = await MQ.insertOne(MODEL.USER_MODEL, req.body);
    if (user) {
      let token = createToken(user.id, user.email);
      if (token) {
        delete user.password;
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
    let user = await MQ.findOne(MODEL.USER_MODEL, { email: email });
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
      delete user.password;
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
      let user = await MQ.findOne(MODEL.USER_MODEL, {email: userData.email});
      if (!user) {
        const insertData = {
          userName: userData.name,
          email: userData.email,
          profilePicture: userData.picture,
          withEmail: true,
        };
        user = await MQ.insertOne(MODEL.USER_MODEL, insertData);
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

export { registerUser, userLogIn, loginWithGoogleHandler };
