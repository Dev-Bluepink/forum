import CategoriesService from "../service/CategoriesService";
import CustomError from "../utils/customError";
import { Response, Request } from "express";

class CategoriesController {
  async addCategory(req: Request, res: Response) {
    try {
      const image = req.cloudinaryUrl;
      if (!image) {
        throw new CustomError(400, "Thiếu hình ảnh của danh mục");
      }
      const { provinceId, name } = req.body;
      if (!provinceId || !name) {
        throw new CustomError(400, "Thiếu thông tin để tạo danh mục");
      }
      const category = await CategoriesService.addCategory(
        provinceId,
        name,
        image
      );
      return category;
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).send("Lỗi máy chủ: " + error);
      }
    }
  }
  async softDeleteCategory(req: Request, res: Response) {
    try {
    } catch (error) {}
  }
}

export default new CategoriesController();
