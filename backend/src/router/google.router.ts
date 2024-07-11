import { Router } from "express";
import passport from "passport";
import { loginWithGoogleHandler } from "../controller/user.controller";

const router = Router();
router.get("/google", passport.authenticate("google", {scope:["profile", "email"]}));
router.get("/google/callback",passport.authenticate("google", {failureRedirect: "/login/failed",}),loginWithGoogleHandler);
export {router as googleRouter}
