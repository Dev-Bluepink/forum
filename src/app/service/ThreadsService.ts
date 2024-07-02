import ThreadsModel from "../models/ThreadsModel";
import CustomError from "../utils/customError";

class ThreadsService {
  async addThread(userId: string, categoryId: string, title: string) {
    try {
      const checkThread = await ThreadsModel.findOne({ categoryId, title });
      if (checkThread) {
        throw new CustomError(400, "Chủ đề này đã tồn tại");
      }
      const thread = await ThreadsModel.create({ userId, categoryId, title });
      if (!thread) {
        throw new CustomError(500, "Lỗi khi tạo mới chủ đề");
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async acceptThread(id: string) {
    try {
      const thread = await ThreadsModel.findById(id);
      if (!thread) {
        throw new CustomError(
          500,
          "Lỗi khi tìm kiếm chủ đề để thay đổi trạng thái"
        );
      }
      thread.status = "Accept";
      await thread.save();
      return thread;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async rejectThread(id: string) {
    try {
      const thread = await ThreadsModel.findById(id);
      if (!thread) {
        throw new CustomError(
          500,
          "Lỗi khi tìm kiếm chủ đề để thay đổi trạng thái"
        );
      }
      thread.status = "Reject";
      await thread.save();
      return thread;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
}
