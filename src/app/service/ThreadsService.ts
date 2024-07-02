import ThreadsModle from "../models/ThreadsModel";
import CustomError from "../utils/customError";

class ThreadsService {
  async addThread(userId: string, categoryId: string, title: string) {
    try {
      const checkThread = await ThreadsModle.findOne({ categoryId, title });
      if (checkThread) {
        throw new CustomError(400, "Chủ đề này đã tồn tại");
      }
      const thread = await ThreadsModle.create({ userId, categoryId, title });
    } catch (error) {}
  }
}
