import { Request, Response } from "express";
import UserService from "../service/UserService";
import { tokenSign } from "../utils/token";
import { IUser } from "../models/UsersModel";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) {
    return res.status(400).send("Thiếu thông tin đăng nhập");
  }

  try {
    const isValidUser = await UserService.validateUser(username, password);
    if (!isValidUser) {
      return res.status(400).send("Username hoặc password không hợp lệ");
    }

    const user = await UserService.findUserByUsername(username);
    if (!user) {
      return res.status(404).send("User không tồn tại");
    }

    const token = tokenSign(user._id.toString());
    res.cookie("tokenLogin", token, {
      expires: new Date(Date.now() + 18000000000),
    });
    res.status(200).send({ message: "Đăng nhập thành công", user, token });
  } catch (error: any) {
    if (error.status && error.message) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" }); // 500 Internal Server Error
    }
  }
};

export const register = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send("Thiếu thông tin đăng ký");
  }

  const { email, password, firstName, lastName, birthday } = req.body;
  const fullname = firstName + " " + lastName;
  const username = req.body.username;

  if (!username || !email || !password) {
    return res.status(400).send("Thiếu thông tin đăng ký");
  }

  try {
    await UserService.addUser(username, email, fullname, birthday, password);

    res.status(201).send("Người dùng đã được đăng ký");
  } catch (error: any) {
    if (error.status && error.message) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" }); // 500 Internal Server Error
    }
  }
};

export const loginGG = (req: Request, res: Response) => {
  console.log("Google callback successful");

  const user = req.user as IUser;
  if (!user) {
    return res.status(400).send("User không tồn tại");
  }
  console.log(user);
  const token = tokenSign(user._id.toString());
  console.log(token);
  res.cookie("tokenLogin", token, {
    expires: new Date(Date.now() + 18000000000),
  });
  res.status(200).send({ message: "Đăng nhập thành công", user, token });
};
