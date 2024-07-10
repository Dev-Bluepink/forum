import FollowThreadsModel from "../models/FollowThreadsModel";
import CustomError from "../utils/customError";

class FollowThreadsService {
  async followThread(info: {}) {
    try {
      const checkFollow = await FollowThreadsModel.findOne(info);
      if (checkFollow) {
        checkFollow.isFollow = !checkFollow.isFollow;
        await checkFollow.save();
        return checkFollow;
      } else {
        const followThread = await FollowThreadsModel.create(info);
        if (!followThread) {
          throw new CustomError(400, "Lỗi khi tạo theo dõi chủ đề");
        }
        return followThread;
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async getFollowThreadsByUserId(userId: string) {
    try {
      const followThreads = await FollowThreadsModel.find({ userId });
      if (!followThreads) {
        throw new CustomError(404, "Không tồn tại theo di chủ đề");
      }
      return followThreads;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
}

export default new FollowThreadsService();
