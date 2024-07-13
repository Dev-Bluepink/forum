import TagsController from "../controller/TagsController";
import { Router } from "express";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Quản lý tags
 */

/**
 * @swagger
 * /tags/get-all-tags:
 *   get:
 *     summary: Lấy tất cả các tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Danh sách tất cả các tags
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-all-tags", TagsController.getAllTags);

/**
 * @swagger
 * /tags/create-tag:
 *   post:
 *     summary: Tạo tag mới
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên của tag
 *     responses:
 *       201:
 *         description: Tạo tag thành công
 *       400:
 *         description: Thiếu tên tag
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/create-tag", TagsController.createTag);

/**
 * @swagger
 * /tags/soft-delete-tag/{id}:
 *   delete:
 *     summary: Xóa mềm tag
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa mềm tag thành công
 *       400:
 *         description: Thiếu ID tag
 *       500:
 *         description: Lỗi máy chủ hoặc lỗi khi xóa mềm
 */
router.delete("/soft-delete-tag/:id", TagsController.softDeleteTag);

module.exports = router;
