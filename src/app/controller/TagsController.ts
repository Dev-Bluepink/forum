import TagsService from "../service/TagsService";
import CustomError from "../utils/customError";
import { Request, Response } from "express";

class TagsController {
  async createTag(req: Request, res: Response) {
    try {
      const name = req.body.name;
      if (!name) {
        throw new CustomError(400, "Vui lòng cung cấp tên của tag");
      }
      const tag = await TagsService.createTag(name);
      if (!tag) {
        throw new CustomError(500, "Lỗi không thể tạo tag");
      }
      res.status(201).json({ message: "Đã tạo tag mới thành công", tag });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ: " + error });
      }
    }
  }
  async getAllTags(req: Request, res: Response) {
    try {
      const tags = await TagsService.getAllTags();
      if (!tags) {
        throw new CustomError(500, "Lỗi khi lấy tất cả các tag");
      }
      res
        .status(200)
        .json({ tags, message: "Đã lấy danh sách các tag thành công" });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ: " + error });
      }
    }
  }
  async softDeleteTag(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) {
        throw new CustomError(400, "Vui lòng cung cấp id của tag");
      }
      const tag = await TagsService.softDeleteTag(id);
      if (!tag) {
        throw new CustomError(500, "Lỗi trong quá trình xóa mềm tag");
      }
      res.status(200).json({ tag, message: "Đã xóa mềm tag thành công" });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ: " + error });
      }
    }
  }
}

export default new TagsController();
