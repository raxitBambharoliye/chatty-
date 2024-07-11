import { Router } from "express";
import logger from "../utility/logger";
import { userRouter } from "./user.router";
import { googleRouter } from "./google.router";
import passport from "passport";


const router = Router();

router.get("/", (req: any, res: any) => {
    logger.debug("test / running ")
    res.status(200).send("OK")
})

router.use("/user",userRouter)
export default router;