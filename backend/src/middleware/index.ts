import jwt from "jsonwebtoken";
import logger from "../utility/logger";

export const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers["x-auth-token"];
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }
    const secret = process.env.JWT_SECRET || "";
      const verify = await jwt.verify(token, secret);
      if (!verify) {
          return res.status(401).json({message:"invalid token"});
      }
      return next();
  } catch (error) {
      logger.error(`CATCH ERROR :: IN :: verifyToken ::: ${error}`)
      console.log('error', error)
      return res.status(401).json({message:"invalid token"});
  }
};
