import { Router } from "express";
import { createGroup, editUserProfile, getMessages, searchUser, sendVerificationMail, updateGroup, userLogIn, verifyEmail} from "../controller/user.controller";
import { reqEditUserProfileValidation, reqLoginValidation, reqUserRegisterValidation } from "../validation/requestValidator";
import { verifyToken } from "../middleware";
import { uploadImage } from "../common/multer";

const router = Router();


router.post('/sendVerificationMail', reqUserRegisterValidation,sendVerificationMail);
router.post('/login', reqLoginValidation, userLogIn);
router.get("/verifyEmail", verifyEmail)
router.post("/editUserProfile",verifyToken,uploadImage.single("profileImage"),reqEditUserProfileValidation,editUserProfile)
router.get("/searchUser/:search",verifyToken, searchUser);
router.post("/getMessage", verifyToken, getMessages)
router.post("/createGroup", verifyToken, uploadImage.single("groupProfile"), createGroup);
router.post("/updateGroup", verifyToken, uploadImage.single("groupProfile"), updateGroup);

export { router as userRouter };