import { Express } from "express";
const HomeRoute = require("./HomeRoute");
const AuthRoute = require("./AuthRoute");
const UserRoute = require("./UserRoute");

export function route(app: Express) {
  app.use("/user", UserRoute);
  app.use("/auth", AuthRoute);
  app.use("/", HomeRoute);
}
