import UserService from "../service/UserService";
import { Request, Response } from "express";
import CustomError from "../utils/customError";

class UserController {
  async getAllUsers(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const PAGE_SIZE = req.query.PAGE_SIZE
      ? parseInt(req.query.PAGE_SIZE as string)
      : 10;
    try {
      const users = await UserService.getAllUser(page, PAGE_SIZE);
      const count = await UserService.countAllUsers();
      const totalPage = Math.ceil(count / PAGE_SIZE);
      res.status(200).json({ count, totalPage, users });
    } catch (error: any) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ nội bộ " + error });
      }
    }
  }
  async getUser(req: Request, res: Response) {
    try {
      const user = await UserService.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      res.status(200).json(user);
    } catch (error: any) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ nội bộ " + error });
      }
    }
  }
  async register(req: Request, res: Response) {
    if (!req.body) {
      return res.status(400).send("Username, email và password là bắt buộc");
    }

    const { email, password, firstName, lastName, birthday } = req.body;
    const username = req.body.username;
    const fullname = firstName + " " + lastName;
    if (!username || !email || !password) {
      return res.status(400).send("Username, email và password là bắt buộc");
    }

    try {
      await UserService.addUser(username, email, fullname, birthday, password);
      res.status(201).send("Người dùng đã được đăng ký");
    } catch (error: any) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ nội bộ " + error });
      }
    }
  }
  async updateUser(req: Request, res: Response) {
    try {
      const {
        firstName,
        lastName,
        birthday,
        city,
        district,
        ward,
        street,
        phone_number,
        fullname,
      } = req.body;
      const data: {} = { fullname, birthday, city, district, ward, street };
      console.log(data);
      const user = await UserService.updateUser(req.params.id, data);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      res
        .status(200)
        .json({ user, message: "Đã cập nhật thông tin người dùng thành công" });
    } catch (error: any) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ nội bộ " + error });
      }
    }
  }
  async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    try {
      const user = await UserService.changePassword(
        req.params.id,
        oldPassword,
        newPassword
      );
      res
        .status(200)
        .json({ user, message: "Đã cập nhật password thành công" });
    } catch (error: any) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ nội bộ " + error });
      }
    }
  }
  async changeAvatar(req: Request, res: Response) {
    try {
      const avatar = req.cloudinaryUrl;
      if (!avatar) {
        return res.status(400).json({ message: "Avatar không được để trống" });
      }
      const user = await UserService.changeAvatar(req.params.id, avatar);
      res.status(200).json({ user, message: "Đã cập nhật avatar thành công" });
    } catch (error: any) {
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Lỗi máy chủ nội bộ " + error });
      }
    }
  }
}

export default new UserController();
