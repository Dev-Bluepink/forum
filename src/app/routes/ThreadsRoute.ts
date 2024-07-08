/**
 * @swagger
 * tags:
 *   name: Thread
 *   description: Quản lý chủ đề
 */
import ThreadsConteoller from "../controller/ThreadsConteoller";
import { Router } from "express";
const router = Router();

/**
 * @swagger
 * /thread/add-thread:
 *   post:
 *     summary: Thêm chủ đề mới
 *     tags: [Thread]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo mới chủ đề thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/add-thread", ThreadsConteoller.addThread);

/**
 * @swagger
 * /thread/accept-thread/{id}:
 *   put:
 *     summary: Chấp thuận chủ đề
 *     tags: [Thread]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id của chủ đề
 *     responses:
 *       200:
 *         description: Đã chấp thuận chủ đề thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/accept-thread/:id", ThreadsConteoller.acceptThread);

/**
 * @swagger
 * /thread/reject-thread/{id}:
 *   put:
 *     summary: Từ chối chủ đề
 *     tags: [Thread]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id của chủ đề
 *     responses:
 *       200:
 *         description: Đã từ chối chủ đề thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/reject-thread/:id", ThreadsConteoller.rejectThread);

/**
 * @swagger
 * /thread/get-all-threads/{categoryId}:
 *   get:
 *     summary: Lấy tất cả chủ đề
 *     tags: [Thread]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Id của danh mục
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
 *         description: Lấy tất cả chủ đề thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-all-threads/:categoryId", ThreadsConteoller.getAllThreads);

module.exports = router;
