


import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { Profile, VerifyCallback } from "passport-google-oauth20";


const clientSecret = process.env.CLIENT_SECRET || "";
const clientID = process.env.CLIENT_ID || "";
passport.use(
  new GoogleStrategy(
    {
		clientID ,
		clientSecret,
		callbackURL: "/auth/google/callback",
		scope: ["profile", "email"],
    },
	function (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) {
		if (profile) {
		  done(null, profile);
		} else {
		  done(null, false);
		}
	  }
  )
);

passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
  done(null, user);
});

passport.deserializeUser((user:any, done: (err: any, id?: unknown) => void) => {
  done(null, user);
});
