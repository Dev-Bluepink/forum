import { Express } from "express";
const HomeRoute = require("./HomeRoute");
const AuthRoute = require("./AuthRoute");
const UserRoute = require("./UserRoute");
const ProvinceRoute = require("./ProvinceRoute");

export function route(app: Express) {
  app.use("/province", ProvinceRoute);
  app.use("/user", UserRoute);
  app.use("/auth", AuthRoute);
  app.use("/", HomeRoute);
}
