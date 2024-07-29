import { Router } from "express";
import { editUserProfile, searchUser, sendVerificationMail, userLogIn, verifyEmail} from "../controller/user.controller";
import { reqEditUserProfileValidation, reqLoginValidation, reqUserRegisterValidation } from "../validation/requestValidator";
import { verifyToken } from "../middleware";
import { uploadImage } from "../common/multer";

const router = Router();


router.post('/sendVerificationMail', reqUserRegisterValidation,sendVerificationMail);
router.post('/login', reqLoginValidation, userLogIn);
router.get("/verifyEmail", verifyEmail)
router.post("/editUserProfile",verifyToken,uploadImage.single("profileImage"),reqEditUserProfileValidation,editUserProfile)
router.get("/searchUser/:search",verifyToken, searchUser);
export { router as userRouter };