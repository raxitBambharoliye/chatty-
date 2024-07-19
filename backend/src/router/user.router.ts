import { Router } from "express";
import { sendVerificationMail, userLogIn, verifyEmail} from "../controller/user.controller";
import { reqLoginValidation, reqUserRegisterValidation } from "../validation/requestValidator";

const router = Router();


router.post('/sendVerificationMail', reqUserRegisterValidation,sendVerificationMail);
router.post('/login', reqLoginValidation, userLogIn);
router.get("/verifyEmail", verifyEmail)

export { router as userRouter };