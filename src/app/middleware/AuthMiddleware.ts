import { Request, Response, NextFunction } from "express";
import { tokenVerify } from "../utils/token";
import UserService from "../service/UserService";

export const checkLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header không tồn tại" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại" });
    }
    try {
      const decoded: any = tokenVerify(token);
      if (!decoded || !decoded._id) {
        return res.status(403).json({ message: "Token không hợp lệ" });
      }

      const user = await UserService.findUserById(decoded._id);
      if (!user) {
        return res.status(401).send("Vui lòng đăng nhập lại");
      }

      // if (user.status === "inactive") {
      //   return res
      //     .status(403)
      //     .json({ message: "Tài khoản của bạn đã bị vô hiệu hóa" });
      // }

      (req as any).user = user;
      // console.log("Xác thực người dùng thành công: " + (req as any).user);
      next();
    } catch (err) {
      // console.error("Lỗi xác thực token:", err);
      return res.status(403).json({ message: "Token không hợp lệ" });
    }
  } catch (err) {
    // console.error("Lỗi xử lý token:", err);
    return res.status(500).send("Lỗi xử lý token");
  }
};
