import CategoriesService from "../service/CategoriesService";
import ProvincesService from "../service/ProvincesService";
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

      const province = await ProvincesService.findProvinceById(provinceId);
      if (!province) {
        throw new CustomError(204, "Lỗi không tìm thấy tỉnh thành bằng Id");
      }
      const path: string = String(province.name);
      const category = await CategoriesService.addCategory(
        provinceId,
        name,
        image,
        path
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
      const categoryId = req.params.id;
      if (!categoryId) {
        throw new CustomError(400, "Vui lòng cung cấp id của danh mục");
      }
      const category = await CategoriesService.softDeleteCategory(categoryId);
      if (!category) {
        throw new CustomError(204, "Lỗi không tìm thấy danh mục");
      }
      res.status(200).json({
        message: "Đã xóa danh mục thành công!",
        category,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).send("Lỗi máy chủ: " + error);
      }
    }
  }
  async getAllCategories(req: Request, res: Response) {
    try {
      const provinceId = req.params.id;
      if (!provinceId) {
        throw new CustomError(400, "Vui lòng gửi Id của tỉnh thành");
      }
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const PAGE_SIZE = req.query.PAGE_SIZE
        ? parseInt(req.query.PAGE_SIZE as string)
        : 10;
      const categogy = await CategoriesService.getAllCategories(
        page,
        PAGE_SIZE,
        provinceId
      );
      const count = await CategoriesService.countCategories();
      const totalPage = Math.ceil(count / PAGE_SIZE);
      res.status(200).json({ count, totalPage, categogy });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).send("Lỗi máy chủ: " + error);
      }
    }
  }
}

export default new CategoriesController();
