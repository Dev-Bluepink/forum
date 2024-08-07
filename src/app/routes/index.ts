import { Express } from "express";
const HomeRoute = require("./HomeRoute");
const AuthRoute = require("./AuthRoute");
const UserRoute = require("./UserRoute");
const ProvinceRoute = require("./ProvinceRoute");
const CategoryRoute = require("./CategoryRoute");
const ThreadRoute = require("./ThreadsRoute");
const PostRoute = require("./PostRoute");
const CommentRoute = require("./CommentRoute");
const TagRoute = require("./TagRoute");
const CategoriesOfKnowledgeRoute = require("./CategoriesOfKnowledgeRoute");

export function route(app: Express) {
  app.use("/categories-of-knowledge", CategoriesOfKnowledgeRoute);
  app.use("/category", CategoryRoute);
  app.use("/province", ProvinceRoute);
  app.use("/comment", CommentRoute);
  app.use("/thread", ThreadRoute);
  app.use("/post", PostRoute);
  app.use("/user", UserRoute);
  app.use("/auth", AuthRoute);
  app.use("/tags", TagRoute);
  app.use("/", HomeRoute);
}
