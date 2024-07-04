import CategoriesController from "../controller/CategoriesController";
import { uploadImage } from "../middleware/UploadImage";
import { Router } from "express";
const router = Router();

router.get("/add-category", uploadImage, CategoriesController.addCategory);

module.exports = router;
