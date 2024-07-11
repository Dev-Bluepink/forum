import CategoriesOfKnowledgeController from "../controller/CategoriesOfKnowledgeController";
import { uploadImage } from "../middleware/UploadImage";
import { Router } from "express";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: CategoriesOfKnowledge
 *   description: Quản lý các danh mục kiến thức
 */

/**
 * @swagger
 * /categories-of-knowledge/get-categories-of-knowledge:
 *   get:
 *     summary: Lấy danh mục kiến thức
 *     tags: [CategoriesOfKnowledge]
 *     responses:
 *       200:
 *         description: Lấy danh mục thành công
 *       204:
 *         description: Không có danh mục nào
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "get-categories-of-knowledge",
  CategoriesOfKnowledgeController.getCategoriesOfKnowledge
);

/**
 * @swagger
 * /categories-of-knowledge/create-categories-of-knowledge:
 *   post:
 *     summary: Tạo danh mục kiến thức
 *     tags: [CategoriesOfKnowledge]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên danh mục
 *               image:
 *                 type: string
 *                 description: Ảnh đại diện
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *       400:
 *         description: Tên danh mục và ảnh đại diện là bắt buộc
 *       500:
 *         description: Lỗi máy chủ
 */
router.post(
  "create-categories-of-knowledge",
  uploadImage,
  CategoriesOfKnowledgeController.createCategoriesOfKnowledge
);

/**
 * @swagger
 * /categories-of-knowledge/soft-delete-categories-of-knowledge/{id}:
 *   delete:
 *     summary: Xóa mềm danh mục kiến thức
 *     tags: [CategoriesOfKnowledge]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 *       204:
 *         description: Danh mục không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete(
  "soft-delete-categories-of-knowledge/:id",
  CategoriesOfKnowledgeController.softDeleteCategoriesOfKnowledge
);

module.exports = router;
