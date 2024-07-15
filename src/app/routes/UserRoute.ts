/**
 * @swagger
 * tags:
 *   name: User
 *   description: Quản lý người dùng
 */
import userController from "../controller/UserController";
import { Router } from "express";
import { checkLogin } from "../middleware/AuthMiddleware";
import { uploadImage } from "../middleware/UploadImage";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         googleId:
 *           type: string
 *         fullname:
 *           type: string
 *         role:
 *           type: string
 *         avatar:
 *           type: string
 */

/**
 * @swagger
 * /user/get-detail-user/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của người dùng
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của người dùng
 *       404:
 *         description: Người dùng không tồn tại
 */
router.get("/get-detail-user/:id", userController.getUser);

// /**
//  * @swagger
//  * /user/toggle-user-status/{id}:
//  *   put:
//  *     summary: Cập nhật trạng thái người dùng
//  *     tags: [User]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID của người dùng
//  *     responses:
//  *       200:
//  *         description: Người dùng đã bị xóa
//  *       404:
//  *         description: Người dùng không tồn tại
//  */
// router.put("/toggle-user-status/:id", userController.toggleUserStatus);

/**
 * @swagger
 * /user/update-user/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               birthday:
 *                 type: string
 *                 description: Ngày sinh của người dùng
 *               city:
 *                 type: string
 *                 description: Thành phố của người dùng
 *               district:
 *                 type: string
 *                 description: Quận/Huyện của người dùng
 *               ward:
 *                 type: string
 *                 description: Xã/Phường của người dùng
 *               street:
 *                 type: string
 *                 description: Đường của người dùng
 *               fullname:
 *                 type: string
 *                 description: Họ và tên đầy đủ của người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Đối tượng thông tin người dùng đã cập nhật
 *                 message:
 *                   type: string
 *                   description: Thông báo cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put("/update-user/:id", userController.updateUser);

/**
 * @swagger
 * /user/get-all-user:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags: [User]
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
 *         description: Danh sách người dùng
 *       404:
 *         description: Không tìm thấy người dùng nào
 */
router.get("/get-all-user", checkLogin, userController.getAllUsers);

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *     responses:
 *       201:
 *         description: Người dùng đã được đăng ký
 *       400:
 *         description: Thiếu thông tin đăng ký
 *       409:
 *         description: Username hoặc email đã tồn tại
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post("/register", userController.register);

/**
 * @swagger
 * /user/change-password/{id}:
 *   put:
 *     summary: Thay đổi mật khẩu người dùng
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Đã cập nhật password thành công
 *       400:
 *         description: Người dùng không tồn tại hoặc mật khẩu cũ không đúng
 *       401:
 *         description: Mật khẩu cũ không đúng
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put("/change-password/:id", userController.changePassword);

/**
 * @swagger
 * /user/change-avatar/{id}:
 *   put:
 *     summary: Thay đổi avatar người dùng
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id của người dùng
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
 *     responses:
 *       200:
 *         description: Đã cập nhật avatar thành công
 *       400:
 *         description: Avatar không được để trống
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put("/change-avatar/:id", uploadImage, userController.changeAvatar);

module.exports = router;
