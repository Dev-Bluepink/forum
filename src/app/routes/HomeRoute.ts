import HomeController from "../controller/HomeController";
import { Router } from "express";
const router = Router();

router.get("/", HomeController.index);

module.exports = router;
