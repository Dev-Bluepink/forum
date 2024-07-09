/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Quản lý bài viết
 */
/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Quản lý báo cáo
 */
import PostsController from "../controller/PostsController";
import ReportController from "../controller/ReportController";
import { uploadImage, uploadImageToUpdate } from "../middleware/UploadImage";
import express from "express";
const router = express.Router();

/**
 * @swagger
 * /post/news-feed:
 *   get:
 *     summary: Lấy danh sách bài viết mới nhất
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Kích thước trang
 *     responses:
 *       200:
 *         description: Danh sách bài viết mới nhất
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/news-feed", PostsController.newsFeed);

/**
 * @swagger
 * /post/create-post:
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               threadId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bài viết đã được tạo thành công
 *       400:
 *         description: Thiếu thông tin cần thiết
 *       404:
 *         description: Không tồn tại luận điểm
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/create-post", uploadImageToUpdate, PostsController.createPost);

/**
 * @swagger
 * /post/soft-delete-post/{id}:
 *   put:
 *     summary: Xóa mềm bài viết
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Bài viết đã được xóa mềm thành công
 *       204:
 *         description: Không tồn tại bài viết
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/soft-delete-post/:id", PostsController.softDeletePost);

/**
 * @swagger
 * /post/list-post-of-thread/{threadId}:
 *   get:
 *     summary: Lấy danh sách bài viết theo ID của chủ đề
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chủ đề
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Kích thước trang
 *     responses:
 *       200:
 *         description: Danh sách bài viết theo ID của chủ đề
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/list-post-of-thread/:threadId",
  PostsController.getPostsByThreadId
);

/**
 * @swagger
 * /post/save-post/{postId}:
 *   post:
 *     summary: Lưu bài viết
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bài viết đã được lưu thành công
 *       204:
 *         description: Không tìm thấy bài viết để lưu
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/save-post/:postId", PostsController.savePost);

/**
 * @swagger
 * /post/upvote-post/{postId}:
 *   post:
 *     summary: Up vote bài viết
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bài viết đã được up vote thành công
 *       204:
 *         description: Không tìm thấy bài viết để up vote
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/upvote-post/:postId", PostsController.upVotePost);

/**
 * @swagger
 * /post/downvote-post/{postId}:
 *   post:
 *     summary: Down vote bài viết
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bài viết đã được down vote thành công
 *       204:
 *         description: Không tìm thấy bài viết để down vote
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/downvote-post/:postId", PostsController.downVotePost);
/**
 * @swagger
 * /post/report-post/{postId}:
 *   post:
 *     summary: Báo cáo bài viết
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Báo cáo đã được tạo thành công
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/report-post/:postId", ReportController.createReport);

module.exports = router;