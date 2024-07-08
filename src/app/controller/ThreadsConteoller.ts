import ThreadsService from "../service/ThreadsService";
import { Request, Response } from "express";
import CustomError from "../utils/customError";
import CategoriesService from "../service/CategoriesService";
class ThreadsController {
  async addThread(req: Request, res: Response) {
    try {
      const categoryId = req.params.id;
      if (!categoryId) {
        throw new CustomError(400, "Vui lòng cung cấp id của danh mục");
      }
      const category = await CategoriesService.findCategoryById(categoryId);
      if (!category) {
        throw new CustomError(204, "Lỗi không tìm thấy được danh mục bằng id");
      }
      const path = `${category.path}/${category.name}`;
      const { userId, title } = req.body;
      if (!userId || !title || !path) {
        throw new CustomError(
          400,
          "Vui lòng cung cấp đầy đủ thông tin để tạo mới chủ đề"
        );
      }
      const thread = await ThreadsService.addThread(
        userId,
        categoryId,
        title,
        path
      );
      if (!thread) {
        throw new CustomError(500, "Lỗi khi tạo mới chủ đề");
      }
      res.status(201).json({ thread, message: "Tạo mới chủ đề thành công" });
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async acceptThread(req: Request, res: Response) {
    try {
      const threadId = req.params.id;
      if (!threadId) {
        throw new CustomError(400, "Vui lòng cung cấp Id của chủ đề!");
      }
      const accepted = await ThreadsService.acceptThread(threadId);
      if (!accepted) {
        throw new CustomError(500, "Lỗi khi chấp thuận chủ đề");
      }
      res.status(200).json({
        accepted,
        message: "Đã chấp thuận chủ đề thành công",
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }

  async rejectThread(req: Request, res: Response) {
    try {
      const threadId = req.params.id;
      if (!threadId) {
        throw new CustomError(400, "Vui lòng cung cấp Id của chủ đề!");
      }
      const accepted = await ThreadsService.rejectThread(threadId);
      if (!accepted) {
        throw new CustomError(500, "Lỗi khi từ chối chủ đề");
      }
      res.status(200).json({
        accepted,
        message: "Đã từ chối chủ đề thành công",
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }

  async getAllThreads(req: Request, res: Response) {
    try {
      const categoryId = req.params.categoryId;
      if (!categoryId) {
        throw new CustomError(400, "Vui lòng cung cấp Id của danh mục");
      }
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const PAGE_SIZE = req.query.PAGE_SIZE
        ? parseInt(req.query.PAGE_SIZE as string)
        : 10;

      const threads = await ThreadsService.getAllThreads(
        page,
        PAGE_SIZE,
        categoryId
      );
      const count = await ThreadsService.countThreads(categoryId);
      const totalPage = Math.ceil(count / PAGE_SIZE);
      res.status(200).json({ count, totalPage, threads });
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
}

export default new ThreadsController();
