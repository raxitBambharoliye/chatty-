import { compare, hash } from "bcrypt";
import { MQ } from "../common";
import { MODEL } from "../constant";
import logger from "../utility/logger"
import jwt from 'jsonwebtoken'
const registerUser =async (req: any, res: any) => {
    try {
        console.log("registerUser req.body", req.body);
        console.log('MODEL.USER_MODEL', MODEL.USER_MODEL)
        req.body.password = await hash(req.body.password, 10);
        const user = await MQ.insertOne(MODEL.USER_MODEL, req.body);
        if (user) {
            res.status(200).json({
                message: "User registered successfully",
            })
        } else {
            res.status(500).json({
                message:"some thing went wrong, please try later",
            })
        }
    } catch (error) {
        logger.error(`CATCH ERROR IN registerUser  :: ${error}`)
        console.log('CATCH ERROR IN registerUser  :: ', error)
    }
}

const userLogIn = async (req: any, res: any) => { 
    try {
        let { email, password } = req.body;
        let user = await MQ.findOne(MODEL.USER_MODEL, { email: email });
        if (!user) {
        return res.status(400).json({
                message:"invalid email address or password"
            })
        }
        if (!await compare(password, user.password)) {
        return res.status(400).json({
                message:"invalid email address or password"
            })
        }
        await MQ.findByIdAndUpdate(MODEL.USER_MODEL,user.id, { isOnLine: true });
        let secret = process.env.JWT_SECRET || "";
        let token = jwt.sign({ userId: user.id, email: user.email }, secret,{expiresIn: 60*60*24});
        if (token) {
            delete user.password;
           return res.status(200).json({
                message: "user logged in successfully",
               userData: user,
                token
            })
        }
    } catch (error) {
        logger.error(`CATCH ERROR IN logIn :: ${error}`);
        console.log('error', error)
    }
}

export { 
    registerUser,
    userLogIn
}