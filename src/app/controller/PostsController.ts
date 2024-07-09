import { Request, Response } from "express";
import PostsService from "../service/PostsService";
import CustomError from "../utils/customError";
import ThreadsModel from "../models/ThreadsModel";

class PostsController {
  async newsFeed(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const PAGE_SIZE = parseInt(req.query.pageSize as string) || 10;
      const posts = await PostsService.newsFeed(page, PAGE_SIZE);
      const count = await PostsService.countPosts();
      const totalPages = Math.ceil(count / PAGE_SIZE);
      res.status(200).json({ posts, totalPages });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ: " + error });
      }
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      const { title, content, threadId } = req.body;
      const image = req.cloudinaryUrl;

      if (!title || !content || !threadId) {
        throw new CustomError(400, "Thiếu thông tin cần thiết");
      }
      const thread = await ThreadsModel.findById(threadId);
      if (!thread) {
        throw new CustomError(404, "Không tồn tại luận điểm");
      }
      const path = `${thread.path}/${thread.title}`;
      const categoryId = thread.categoryId;
      let info: {};
      if (image) {
        info = { title, content, threadId, path, categoryId, image };
      } else {
        info = { title, content, threadId, path, categoryId };
      }
      const post = await PostsService.addPost(info);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ: " + error });
      }
    }
  }
  async softDeletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await PostsService.softDeletePost(id);
      if (!post) {
        throw new CustomError(204, "Không tồn tại bài viết");
      }
      res.status(200).json(post);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ: " + error });
      }
    }
  }
  async getPostsByThreadId(req: Request, res: Response) {
    try {
      const { threadId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const PAGE_SIZE = parseInt(req.query.pageSize as string) || 10;
      const posts = await PostsService.getPostsByThreadId(
        threadId,
        page,
        PAGE_SIZE
      );
      const count = await PostsService.countPostsByThreadId(threadId);
      const totalPages = Math.ceil(count / PAGE_SIZE);
      res.status(200).json({ posts, totalPages });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ: " + error });
      }
    }
  }
  async savePost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const userId = req.body.userId;
      const post = await PostsService.savePost(postId, userId);
      if (!post) {
        throw new CustomError(204, "Không tìm thấy bài viết để lưu");
      }
      res.status(200).json(post);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ: " + error });
      }
    }
  }
  async upVotePost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const userId = req.body.userId;
      const post = await PostsService.upVotePost(postId, userId);
      if (!post) {
        throw new CustomError(204, "Không tìm thấy bài viết để up vote");
      }
      res.status(200).json(post);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ: " + error });
      }
    }
  }
  async downVotePost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const userId = req.body.userId;
      const post = await PostsService.downVotePost(postId, userId);
      if (!post) {
        throw new CustomError(204, "Không tìm thấy bài viết để down vote");
      }
      res.status(200).json(post);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ: " + error });
      }
    }
  }
}

export default new PostsController();
