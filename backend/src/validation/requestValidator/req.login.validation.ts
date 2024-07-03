import { body, validationResult } from "express-validator";

const reqLoginValidation = [
    body("email")
        .isEmail().withMessage("Please enter valid email address")
        .notEmpty().withMessage("Please enter valid email address"),
    body("password")
        .notEmpty().withMessage("Please enter  password"),
    (req: any, res: any, next: any) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }
        return next();
    }
]


export default reqLoginValidation;