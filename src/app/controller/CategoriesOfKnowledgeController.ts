import { Request, Response } from "express";
import CategoriesOfKnowledgeService from "../service/CategoriesOfKnowledgeService";
import CustomError from "../utils/customError";

class CategoriesOfKnowledgeController {
  async getCategoriesOfKnowledge(req: Request, res: Response) {
    try {
      const categoriesOfKnowledge =
        await CategoriesOfKnowledgeService.getCategoriesOfKnowledge();
      if (categoriesOfKnowledge.length === 0) {
        throw new CustomError(204, "Không có danh mục nào");
      }
      res.status(200).json({
        message: "Lấy danh mục thành công",
        categoriesOfKnowledge,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json(error.message);
      } else {
        res.status(500).json("Lỗi máy chủ: " + error);
      }
    }
  }
  async createCategoriesOfKnowledge(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const image = req.cloudinaryUrl;
      if (!name || !image) {
        throw new CustomError(400, "Tên danh mục và ảnh đại diện là bắt buộc");
      }
      const data: { name: string; image: string } = { name, image };
      const categoriesOfKnowledge =
        await CategoriesOfKnowledgeService.createCategoriesOfKnowledge(data);
      res.status(201).json({
        message: "Tạo danh mục thành công",
        categoriesOfKnowledge,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json(error.message);
      } else {
        res.status(500).json("Lỗi máy chủ: " + error);
      }
    }
  }
  async softDeleteCategoriesOfKnowledge(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoriesOfKnowledge =
        await CategoriesOfKnowledgeService.softDeleteCategoriesOfKnowledge(id);
      res.status(200).json({
        message: "Xóa danh mục thành công",
        categoriesOfKnowledge,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json(error.message);
      } else {
        res.status(500).json("Lỗi máy chủ: " + error);
      }
    }
  }
}

export default new CategoriesOfKnowledgeController();
