import { body, validationResult } from "express-validator";
import { UserIN } from "../../utility/interfaces";
import { MQ } from "../../common";
import { MODEL } from "../../constant";

export const reqEditUserProfileValidation = [
    body("userId").notEmpty().withMessage("place enter userId "),
    body("userName").notEmpty().withMessage("place enter user name")
        .custom(async (value,{req}) => {
            const userData = await MQ.find<UserIN[]>(MODEL.USER_MODEL, { userName: value });
            console.log('userData', userData)
            if (userData && userData.length > 0 && userData[0].id != req.body.userId) {
                throw new Error('user Id was already in use')
            }
        }),
    body('DOB').isDate(),
    body('tagLine').isString(),
    (req: any, res: any, next: any) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }
        console.log("test check")
        return next();
    }
]