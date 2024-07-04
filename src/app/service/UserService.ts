import UserModel from "../models/UsersModel";
import { Response, Request } from "express";
import CustomError from "../utils/customError";
import { hashPassword, comparePassword } from "../utils/hash";

class UserService {
  async addUser(
    username: string,
    email: string,
    fullname: string,
    birthday: string,
    password: string,
    googleId?: string
  ) {
    // Kiểm tra xem username và email đã tồn tại chưa
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      // Nếu người dùng đăng nhập bằng Google và email đã tồn tại, cập nhật googleId
      if (googleId && existingUser.email === email && fullname) {
        existingUser.googleId = googleId;
        existingUser.fullname = fullname;
        await existingUser.save();
        return existingUser;
      }
      const errorMessage = "Username hoặc email đã tồn tại";
      throw new CustomError(409, errorMessage); // 409 Conflict
    }
    const hashedPassword = hashPassword(password);
    try {
      const newUser = new UserModel({
        username,
        email,
        birthday,
        password: hashedPassword,
        fullname,
        googleId,
      });
      await newUser.save();
      return newUser;
    } catch (error: any) {
      if (error.status && error.message) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ nội bộ: " + error); // 500 Internal Server Error
      }
    }
  }
  async findUserByGoogleId(email: string, googleId: string) {
    if (!email || !googleId) {
      const errorMessage = "Email hoặc Google ID không hợp lệ";
      throw new CustomError(400, errorMessage); // 400 Bad Request
    }

    const checkMail = await UserModel.findOne({ email });
    if (checkMail) {
      if (checkMail.googleId === googleId) {
        return checkMail;
      } else {
        const updatedUser = await UserModel.findOneAndUpdate(
          { email },
          { googleId },
          { new: true }
        );
        if (!updatedUser) {
          const errorMessage = "Không thể cập nhật Google ID";
          throw new CustomError(500, errorMessage); // 500 Internal Server Error
        }
        return updatedUser;
      }
    } else {
      return null;
    }
  }
  async findUserById(idUser: string) {
    if (!idUser) {
      const errorMessage = "Id user không hợp lệ";
      throw new CustomError(400, errorMessage); // 400 Bad Request
    }
    return UserModel.findById(idUser);
  }
  async findUserByUsername(username: string) {
    //Kiểm tra xem username có hợp lệ không
    if (!username) {
      const errorMessage = "Username không hợp lệ";
      throw new CustomError(400, errorMessage); // 400 Bad Request
    }
    return UserModel.findOne({ username });
  }
  async validateUser(username: string, password: string) {
    //Kiểm tra xem username và password có hợp lệ không
    const user = await this.findUserByUsername(username);
    if (!user) {
      const errorMessage = "User không tồn tại";
      throw new CustomError(204, errorMessage); // 204 Not Found
    }
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      const errorMessage = "Password không đúng";
      throw new CustomError(401, errorMessage); // 401 Unauthorized
    }
    return true;
  }
  async countAllUsers() {
    try {
      return await UserModel.countDocuments({});
    } catch (error: any) {
      throw new CustomError(500, "Lỗi máy chủ nội bộ: " + error); // 500 Internal Server Error
    }
  }

  async getAllUser(page: number, PAGE_SIZE: number) {
    try {
      const users = await UserModel.find({})
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);
      if (!users || users.length === 0) {
        throw new CustomError(204, "Không tìm thấy người dùng nào"); // 204 Not Found
      }
      return users;
    } catch (error: any) {
      if (error.status && error.message) {
        throw new CustomError(error.status, error.message);
      } else {
        if (error.status && error.message) {
          throw new CustomError(error.status, error.message);
        } else {
          throw new CustomError(500, "Lỗi máy chủ nội bộ: " + error); // 500 Internal Server Error
        }
      }
    }
  }
  async getUser(idUser: string) {
    if (!idUser) {
      const errorMessage = "Id user không hợp lệ";
      throw new CustomError(400, errorMessage); // 400 Bad Request
    }
    const user = await UserModel.findById(idUser);
    if (!user) {
      const errorMessage = "Người dùng không tồn tại";
      throw new CustomError(204, errorMessage); // 204 Not Found
    }
    return user;
  }

  async updateUser(idUser: string, user: any) {
    if (!idUser) {
      const errorMessage = "Id user không hợp lệ";
      throw new CustomError(400, errorMessage); // 400 Bad Request
    }
    const updateFields: any = {};
    if (user.username) updateFields.username = user.username;
    if (user.email) updateFields.email = user.email;
    if (user.password) updateFields.password = hashPassword(user.password);
    if (user.fullname) updateFields.fullname = user.fullname;
    if (user.avatar) updateFields.avatar = user.avatar;
    if (user.role) updateFields.role = user.role;
    try {
      if (Object.keys(updateFields).length === 0) {
        const errorMessage = "Không có trường nào được cập nhật";
        throw new CustomError(400, errorMessage); // 400 Bad Request
      }
      if (user.username) {
        const existingUser = await UserModel.findOne({
          username: user.username,
        });
        if (existingUser) {
          const errorMessage = "Username đã tồn tại";
          throw new CustomError(409, errorMessage); // 409 Conflict
        }
      }
      if (user.email) {
        const existingUser = await UserModel.findOne({ email: user.email });
        if (existingUser) {
          const errorMessage = "Email đã tồn tại";
          throw new CustomError(409, errorMessage); // 409 Conflict
        }
      }
      const updatedUser = await UserModel.findByIdAndUpdate(
        idUser,
        updateFields,
        {
          new: true,
        }
      );
      if (!updatedUser) {
        const errorMessage = "Người dùng không tồn tại";
        throw new CustomError(204, errorMessage); // 204 Not Found
      }
      return updatedUser;
    } catch (error: any) {
      if (error.status && error.message) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ nội bộ: " + error); // 500 Internal Server Error
      }
    }
  }
}

export default new UserService();
