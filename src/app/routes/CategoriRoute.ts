import CategoriesController from "../controller/CategoriesController";
import { uploadImage } from "../middleware/UploadImage";
import { Router } from "express";
const router = Router();

/**
 * @swagger
 * /category/add-category:
 *   post:
 *     summary: Thêm danh mục mới
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               provinceId:
 *                 type: string
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Danh mục đã được thêm thành công
 *       400:
 *         description: Thiếu thông tin để tạo danh mục
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/add-category", uploadImage, CategoriesController.addCategory);

/**
 * @swagger
 * /category/delete-category/{id}:
 *   put:
 *     summary: Xóa mềm danh mục
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Đã xóa danh mục thành công
 *       400:
 *         description: Vui lòng cung cấp id của danh mục
 *       204:
 *         description: Lỗi không tìm thấy danh mục
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/delete-category/:id", CategoriesController.softDeleteCategory);
/**
 * @swagger
 * /category/get-all-category/{provinceId}:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [Category]
 *     parameters:
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
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id của tỉnh thành
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 *       400:
 *         description: Vui lòng gửi Id của tỉnh thành
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/get-all-category/:provinceId",
  CategoriesController.getAllCategories
);

module.exports = router;
