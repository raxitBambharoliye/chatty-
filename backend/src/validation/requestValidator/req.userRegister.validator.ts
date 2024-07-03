import { body, validationResult } from "express-validator";
import { MQ } from "../../common";
import { MODEL } from "../../constant";


const reqUserRegisterValidation = [
    body('userName').isString()
        .notEmpty().withMessage("Please enter user name ")
        .custom(async (value) => {
            let getUserByName = await MQ.find(MODEL.USER_MODEL, { userName: value });
            if (getUserByName.length) {
                throw new Error('User name already exists');
            }
        }),
    body("DOB")
        .isDate().withMessage("invalid date type")//date yyyy/mm/dd
        .notEmpty().withMessage("place enter your date of birth"),
    body("email").isString()
        .notEmpty().withMessage("Please enter your email address")
        .isEmail().withMessage("place enter valid email address")
        .custom(async(value) => {
            let getUserByEmail = await MQ.find(MODEL.USER_MODEL, { email: value });
            if (getUserByEmail.length) {
                throw new Error('Email already exists');
            }
        }),
    body("password")
        .isString()
        .notEmpty().withMessage("Please enter a password")
        .isLength({ min: 6 }).withMessage("password must be at least 6 characters"),
    (req: any, res: any, next: any) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }
        return next();
    }
]
export default reqUserRegisterValidation;
