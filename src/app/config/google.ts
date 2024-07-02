import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserService from "../service/UserService";
import fs from "fs";
import path from "path";
import "dotenv/config";
const isDistFolderExists = fs.existsSync(
  path.resolve(__dirname, "../../../dist")
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID || "",
      clientSecret: process.env.CLIENT_SECRET || "",
      callbackURL: isDistFolderExists
        ? "https://api-wls-demo-v1-1.onrender.com/auth/google/callback"
        : "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(process.env.CLIENT_ID);
        console.log(process.env.CLIENT_SECRET);
        const { id, emails, displayName } = profile;
        const email = emails ? emails[0].value : "";
        const username = displayName;

        if (!email || !id) {
          return done(new Error("Email hoặc Google ID không hợp lệ"), false);
        }

        let user = await UserService.findUserByGoogleId(email, id);
        if (!user) {
          user = await UserService.addUser(email, email, "", id, username);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserService.findUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
