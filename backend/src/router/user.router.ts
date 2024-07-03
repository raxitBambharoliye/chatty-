import { Router } from "express";
import logger from "../utility/logger";
import { registerUser, userLogIn } from "../controller/user.controller";
import { reqLoginValidation, reqUserRegisterValidation } from "../validation/requestValidator";

const router = Router();


router.post('/register', reqUserRegisterValidation,registerUser);
router.post('/login', reqLoginValidation, userLogIn);

export { router as userRouter };