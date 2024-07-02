import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { route } from "./app/routes";
import { connect } from "./app/config/db";
import passport from "passport";
import swaggerSpec from "./app/config/swagger";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", __dirname + "/../views");
app.set("view engine", "ejs");

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(passport.initialize());
app.use(passport.session());
connect();
route(app);
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
