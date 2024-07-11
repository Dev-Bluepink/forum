import { Request, Response } from "express";
import ReportService from "../service/ReportService";
import PostsService from "../service/PostsService";
import CustomError from "../utils/customError";

class ReportController {
  async createReport(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const { userId, reason } = req.body;
      const post = await PostsService.getPostById(postId);
      if (!post || Array.isArray(post)) {
        throw new CustomError(404, "Không tìm thấy bài viết");
      }
      const countReport: number = (post as any).countReport as number;
      if (countReport >= 3) {
        await PostsService.softDeletePost(postId);
      }
      let info: {};
      info = {
        postId: postId,
        userId: userId,
        reason: reason,
      };
      const report = await ReportService.createReport(info);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json(error);
      } else {
        res.status(500).json({ message: "Lỗi máy chủ: " + error });
      }
    }
  }
}

export default new ReportController();
