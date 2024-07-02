import HomeController from "../controller/HomeController";
import { Router } from "express";
import { checkLogin } from "../middleware/AuthMiddleware";
const router = Router();

router.get("/", HomeController.index);

module.exports = router;
