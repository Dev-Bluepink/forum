import CommentsService from "../service/CommentsService";
import { Request, Response } from "express";
import CustomError from "../utils/customError";

class CommentsController {
  async getCommentsByPostId(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      if (!postId) {
        throw new CustomError(400, "Vui lòng nhập ID bài viết");
      }
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const PAGE_SIZE = req.query.PAGE_SIZE
        ? parseInt(req.query.PAGE_SIZE as string)
        : 10;
      const comments = await CommentsService.getCommentsByPostId(
        postId,
        page,
        PAGE_SIZE
      );
      res.status(200).json(comments);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).send("Lỗi máy chủ: " + error);
      }
    }
  }
  async softDeleteComment(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      if (!commentId) {
        throw new CustomError(400, "Vui lòng nhập ID bình luận");
      }
      const comment = await CommentsService.softDeleteComment(commentId);
      if (!comment) {
        throw new CustomError(400, "Không tìm thấy bình luận cần xóa");
      }
      res.status(200).json(comment);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).send("Lỗi máy chủ: " + error);
      }
    }
  }
  async createComment(req: Request, res: Response) {
    try {
      const { postId, content, userId } = req.body;
      if (!postId || !content || !userId) {
        throw new CustomError(
          400,
          "Vui lòng nhập ID bài viết và nội dung bình luận"
        );
      }
      const detail = {
        postId,
        content,
        userId,
      };
      const comment = await CommentsService.createComment(detail);
      res.status(200).json(comment);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).send("Lỗi máy chủ: " + error);
      }
    }
  }
}

export default new CommentsController();
