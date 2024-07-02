import * as express from "express";
const router = express.Router();
import passport from "../config/google";
import { login, register, loginGG } from "../controller/AuthController";

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Các tuyến xác thực
 *
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng nhập thành công"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                 token:
 *                   type: string
 *                   example: "jwt_token"
 *       400:
 *         description: Thiếu thông tin đăng nhập hoặc thông tin không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Đăng nhập bằng Google
 *     description: Sử dụng Google OAuth để đăng nhập.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Chuyển hướng đến trang xác thực của Google.
 *       500:
 *         description: Lỗi máy chủ.
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Xử lý callback từ Google
 *     description: Xử lý callback sau khi người dùng xác thực với Google.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đăng nhập thành công.
 *       401:
 *         description: Xác thực thất bại.
 *       500:
 *         description: Lỗi máy chủ.
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  loginGG
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/"); // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
  });
});
// Route để bắt đầu xác thực với Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// Route để xử lý callback từ Facebook
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
