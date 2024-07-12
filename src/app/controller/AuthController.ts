import { Request, Response } from "express";
import UserService from "../service/UserService";
import { tokenSign } from "../utils/token";
import { IUser } from "../models/UsersModel";
import { generateOTP, storeOTP, verifyOTP } from "../utils/otpService";
import { sendMailToResetPassword } from "../utils/emailService";
import { hashPassword } from "../utils/hash";
import CustomError from "../utils/customError";

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
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Lỗi server" });
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
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Lỗi server" });
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

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Thiếu email" });
  }

  const info: {} = { email };

  try {
    const user = await UserService.findOneUser(info);
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    const otp = generateOTP();
    await sendMailToResetPassword(email, otp);
    storeOTP(req, email, otp);

    res.status(200).json({ message: "Email chứa mã OTP đã được gửi" });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Lỗi máy chủ: " + error });
    }
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  console.log(email, otp, newPassword + "đây là thông tin reset password");

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
  }

  try {
    // Kiểm tra OTP
    if (!verifyOTP(req, email, otp)) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ" });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await hashPassword(newPassword);

    const info: {} = { email };
    const update: {} = { password: hashedPassword };
    // Cập nhật mật khẩu
    const user = await UserService.findOneAndUpdateUser(info, update);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công" });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Lỗi server" });
    }
  }
};
