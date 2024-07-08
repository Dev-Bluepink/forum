import { Express } from "express";
const HomeRoute = require("./HomeRoute");
const AuthRoute = require("./AuthRoute");
const UserRoute = require("./UserRoute");
const ProvinceRoute = require("./ProvinceRoute");
const CategoryRoute = require("./CategoriRoute");
const ThreadRoute = require("./ThreadsRoute");

export function route(app: Express) {
  app.use("/caterory", CategoryRoute);
  app.use("/province", ProvinceRoute);
  app.use("/thread", ThreadRoute);
  app.use("/user", UserRoute);
  app.use("/auth", AuthRoute);
  app.use("/", HomeRoute);
}
