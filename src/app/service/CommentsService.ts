import CommentsModel from "../models/CommentsModel";
import CustomError from "../utils/customError";

class CommentsService {
  async createComment(comment: {}) {
    try {
      const newComment = await CommentsModel.create(comment);
      if (!newComment) {
        throw new CustomError(400, "Comment not found");
      }
      return newComment;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async softDeleteComment(commentId: string) {
    try {
      const comment = await CommentsModel.findByIdAndUpdate(commentId, {
        isDeleted: true,
      });
      if (!comment) {
        throw new CustomError(204, "Không tìm thấy bình luận cần xóa");
      }
      return comment;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }

  async getCommentsByPostId(postId: string, page: number, PAGE_SIZE: number) {
    try {
      const comments = await CommentsModel.find({ postId, isDeleted: false })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .populate("userId")
        .populate({
          path: "commentId",
          populate: {
            path: "userId",
          },
        })
        .sort({ createdAt: 1 });

      if (comments.length === 0) {
        throw new CustomError(204, "Không tìm thấy bình luận nào của bài viết");
      }
      return comments;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
}

export default new CommentsService();
