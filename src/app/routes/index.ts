import { Express } from "express";
const HomeRoute = require("./HomeRoute");
const AuthRoute = require("./AuthRoute");
const UserRoute = require("./UserRoute");
const ProvinceRoute = require("./ProvinceRoute");
const CategoryRoute = require("./CategoryRoute");
const ThreadRoute = require("./ThreadsRoute");
const PostRoute = require("./PostRoute");

export function route(app: Express) {
  app.use("/caterory", CategoryRoute);
  app.use("/province", ProvinceRoute);
  app.use("/thread", ThreadRoute);
  app.use("/post", PostRoute);
  app.use("/user", UserRoute);
  app.use("/auth", AuthRoute);
  app.use("/", HomeRoute);
}
