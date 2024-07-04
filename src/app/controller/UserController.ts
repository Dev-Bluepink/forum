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
      const user = await UserService.updateUser(req.params.id, req.body);
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
}

export default new UserController();
