import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { route } from "./app/routes";
import { connect } from "./app/config/db";
import passport from "passport";
import swaggerSpec from "./app/config/swagger";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import "dotenv/config";
import MongoStore from "connect-mongo";
connect();

const port = process.env.PORT || 3000;

const app = express();
// const allowedOrigins = [
//   "https://donghanhcungcon.vn",
//   "https://blogmevabe-fe.vercel.app",
//   "http://localhost:3000",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", __dirname + "/../views");
app.set("view engine", "ejs");

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 180 * 60 * 1000, secure: false }, // Set to true if you use HTTPS
  })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(passport.initialize());
app.use(passport.session());
route(app);
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
