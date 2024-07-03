/**
 * @swagger
 * tags:
 *   name: Province
 *   description: Quản lý tỉnh thành
 */
import { Router } from "express";
import ProvincesController from "../controller/ProvincesController";
const router = Router();

/**
 * @swagger
 * /province/get-all-province:
 *   get:
 *     summary: Lấy tất cả các tỉnh
 *     tags: [Province]
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
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 totalPage:
 *                   type: integer
 *                 province:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       numCategories:
 *                         type: integer
 *                       totalParticipants:
 *                         type: integer
 *       204:
 *         description: Không tìm thấy tỉnh nào
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-all-province", ProvincesController.getAllProvinces);
/**
 * @swagger
 * /province/add-province:
 *   post:
 *     summary: Thêm tỉnh mới
 *     tags: [Province]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               province:
 *                 type: string
 *                 example: "Hà Nội"
 *     responses:
 *       201:
 *         description: Tỉnh mới đã được thêm thành công
 *       400:
 *         description: Vui lòng nhập tên tỉnh muốn thêm
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/add-province", ProvincesController.addProvince);
/**
 * @swagger
 * /province/change-status-province:
 *   post:
 *     summary: Thay đổi trạng thái của tỉnh
 *     tags: [Province]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provinceId:
 *                 type: string
 *                 example: "60b8d295f1b2c72b6c8b4567"
 *     responses:
 *       200:
 *         description: Trạng thái của tỉnh đã được thay đổi thành công
 *       400:
 *         description: Vui lòng truyền Id của tỉnh thành
 *       204:
 *         description: lỗi khi tìm kiếm tỉnh thành để thay đổi trạng thái
 *       500:
 *         description: Lỗi máy chủ
 */
router.post(
  "/change-status-province",
  ProvincesController.changeStatusProvince
);

module.exports = router;
