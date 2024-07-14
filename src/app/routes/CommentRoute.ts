import { Router } from "express";
import CommentsController from "../controller/CommentsController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Quản lý bình luận
 */
/**
 * @swagger
 * /comment/get-comments/{postId}:
 *   get:
 *     summary: Lấy danh sách bình luận theo ID bài viết
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: PAGE_SIZE
 *         schema:
 *           type: integer
 *         description: Kích thước trang
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Lỗi yêu cầu
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-comments/:postId", CommentsController.getCommentsByPostId);

/**
 * @swagger
 * /comment/create-comment:
 *   post:
 *     summary: Tạo bình luận mới hoặc bình luận con
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID của bài viết mà bình luận thuộc về
 *               content:
 *                 type: string
 *                 description: Nội dung của bình luận
 *               userId:
 *                 type: string
 *                 description: ID của người dùng tạo bình luận
 *               commentId:
 *                 type: string
 *                 description: ID của bình luận cha (nếu là bình luận con, không bắt buộc)
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Lỗi yêu cầu
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/create-comment", CommentsController.createComment);

/**
 * @swagger
 * /comment/delete-comment/{commentId}:
 *   delete:
 *     summary: Xóa mềm bình luận theo ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bình luận
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Lỗi yêu cầu
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete(
  "/delete-comment/:commentId",
  CommentsController.softDeleteComment
);

module.exports = router;
