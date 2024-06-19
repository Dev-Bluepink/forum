import { Express } from "express";
const HomeRoute = require("./HomeRoute");

export function route(app: Express) {
  app.use("/", HomeRoute);
}
