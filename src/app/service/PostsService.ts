import PostsModel from "../models/PostsModel";
import CustomError from "../utils/customError";
import VotesModel from "../models/VotesModel";
import SavePostsModel from "../models/SavePostsModel";

class PostsService {
  async addPost(info: {}) {
    try {
      const post = await PostsModel.create(info);
      if (!post) {
        throw new CustomError(400, "Lỗi khi thực hiện tạo mới bài viết ");
      }
      return post;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }

  async softDeletePost(id: string) {
    try {
      const post = await PostsModel.findByIdAndUpdate(
        id,
        { isDelete: true },
        {
          new: true,
        }
      );
      if (!post) {
        throw new CustomError(500, "Lỗi trong quá trình xóa mềm bài viết");
      }
      return post;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async upVotePost(postId: string, userId: string) {
    try {
      let Voted;
      const check = await VotesModel.findOne({
        postsId: postId,
        userId: userId,
      });
      if (!check) {
        Voted = await VotesModel.create({
          postsId: postId,
          userId: userId,
          vote: "up",
        });
        return Voted;
      }
      const vote = check.vote;
      if (vote === "up") {
        Voted = await VotesModel.findByIdAndUpdate(
          check._id,
          {
            vote: "none",
          },
          { new: true }
        );
        return Voted;
      }
      if (vote === "none" || vote === "down") {
        Voted = await VotesModel.findByIdAndUpdate(
          check._id,
          {
            vote: "up",
          },
          { new: true }
        );
        return Voted;
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async downVotePost(postId: string, userId: string) {
    try {
      let Voted;
      const check = await VotesModel.findOne({
        postsId: postId,
        userId: userId,
      });
      if (!check) {
        Voted = await VotesModel.create({
          postsId: postId,
          userId: userId,
          vote: "down",
        });
        return Voted;
      }
      const vote = check.vote;
      if (vote === "down") {
        Voted = await VotesModel.findByIdAndUpdate(check._id, {
          vote: "none",
        });
        return Voted;
      }
      if (vote === "none" || vote === "up") {
        Voted = await VotesModel.findByIdAndUpdate(check._id, {
          vote: "down",
        });
        return Voted;
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async savePost(postId: string, userId: string) {
    try {
      const check = await SavePostsModel.findOne({
        postsId: postId,
        userId: userId,
      });
      if (!check) {
        const saved = await SavePostsModel.create({
          postsId: postId,
          userId: userId,
        });
        return saved;
      }
      if (check.isDelete) {
        const saved = await SavePostsModel.findByIdAndUpdate(
          check._id,
          {
            isDelete: false,
          },
          { new: true }
        );
        return saved;
      } else {
        const saved = await SavePostsModel.findByIdAndUpdate(
          check._id,
          {
            isDelete: true,
          },
          { new: true }
        );
        return saved;
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }

  async newsFeed(page: number, PAGE_SIZE: number, userId?: string) {
    try {
      let posts;
      if (!userId) {
        posts = await PostsModel.find({ isDelete: false })
          .skip((page - 1) * PAGE_SIZE)
          .limit(PAGE_SIZE)
          .sort({
            createdAt: -1,
          });
      } else {
        posts = await PostsModel.aggregate([
          { $match: { isDelete: false } },
          { $skip: (page - 1) * PAGE_SIZE },
          { $limit: PAGE_SIZE },
          {
            $lookup: {
              from: "Tags",
              let: { postId: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$postsId", "$$postId"] } } },
              ],
              as: "tags",
            },
          },
          { $addFields: { tags: { $first: "$tags" } } },
          {
            $lookup: {
              from: "FollowThreads",
              let: { threadId: "$threadId", userId: userId },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$threadId", "$$threadId"] },
                        { $eq: ["$userId", "$$userId"] },
                        { $eq: ["$isFollow", true] },
                      ],
                    },
                  },
                },
                { $project: { _id: 1 } },
              ],
              as: "isFollow",
            },
          },
          {
            $addFields: {
              isFollow: {
                $cond: {
                  if: { $gt: [{ $size: "$isFollow" }, 0] },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $lookup: {
              from: "Votes",
              let: { postId: "$_id", userId: userId },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$postsId", "$$postId"] },
                        { $eq: ["$userId", "$$userId"] },
                      ],
                    },
                  },
                },
                { $project: { vote: 1 } },
              ],
              as: "votes",
            },
          },
          {
            $addFields: {
              votes: { $first: "$votes.vote" },
            },
          },
          { $sort: { createdAt: -1 } },
        ]);
      }
      if (!posts) {
        throw new CustomError(204, "Không tìm thấy bài viết");
      }
      return posts;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async countPosts() {
    try {
      const count = await PostsModel.countDocuments({ isDelete: false });
      if (!count) {
        throw new CustomError(204, "Lỗi khi đếm tổng số bài viết");
      }
      return count;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async getPostsByThreadId(threadId: string, page: number, PAGE_SIZE: number) {
    try {
      const posts = await PostsModel.find({ threadId: threadId }).sort({
        createdAt: -1,
      });
      if (!posts) {
        throw new CustomError(204, "Không tồn tại bài viết");
      }
      return posts;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async countPostsByThreadId(threadId: string) {
    try {
      const count = await PostsModel.countDocuments({ threadId: threadId });
      if (!count) {
        throw new CustomError(204, "Lỗi khi đếm tổng số bài viết của chủ đề");
      }
      return count;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async getPostById(postId: string, userId?: string) {
    try {
      let post;
      if (!userId) {
        post = await PostsModel.findOne({ _id: postId, isDelete: false });
      } else {
        post = await PostsModel.aggregate([
          { $match: { isDelete: false } },
          {
            $lookup: {
              from: "Tags",
              let: { postId: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$postsId", "$$postId"] } } },
              ],
              as: "tags",
            },
          },
          { $addFields: { tags: { $first: "$tags" } } },
          {
            $lookup: {
              from: "FollowThreads",
              let: { threadId: "$threadId", userId: userId },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$threadId", "$$threadId"] },
                        { $eq: ["$userId", "$$userId"] },
                        { $eq: ["$isFollow", true] },
                      ],
                    },
                  },
                },
                { $project: { _id: 1 } },
              ],
              as: "isFollow",
            },
          },
          {
            $addFields: {
              isFollow: {
                $cond: {
                  if: { $gt: [{ $size: "$isFollow" }, 0] },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $lookup: {
              from: "Votes",
              let: { postId: "$_id", userId: userId },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$postsId", "$$postId"] },
                        { $eq: ["$userId", "$$userId"] },
                      ],
                    },
                  },
                },
                { $project: { vote: 1 } },
              ],
              as: "votes",
            },
          },
          {
            $addFields: {
              votes: { $first: "$votes.vote" },
            },
          },
          { $sort: { createdAt: -1 } },
        ]);
      }
      if (!post) {
        throw new CustomError(204, "Không tìm thấy bài viết");
      }
      return post;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async searchPosts(
    keyword: string,
    page: number,
    PAGE_SIZE: number,
    userId?: string
  ) {
    try {
      let posts;
      if (!userId) {
        posts = await PostsModel.find({
          isDelete: false,
          title: { $regex: keyword },
        })
          .skip((page - 1) * PAGE_SIZE)
          .limit(PAGE_SIZE)
          .sort({
            createdAt: -1,
          });
      } else {
        posts = await PostsModel.aggregate([
          { $match: { isDelete: false, title: { $regex: keyword } } },
          { $skip: (page - 1) * PAGE_SIZE },
          { $limit: PAGE_SIZE },
          {
            $lookup: {
              from: "Tags",
              let: { postId: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$postsId", "$$postId"] } } },
              ],
              as: "tags",
            },
          },
          { $addFields: { tags: { $first: "$tags" } } },
          {
            $lookup: {
              from: "FollowThreads",
              let: { threadId: "$threadId", userId: userId },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$threadId", "$$threadId"] },
                        { $eq: ["$userId", "$$userId"] },
                        { $eq: ["$isFollow", true] },
                      ],
                    },
                  },
                },
                { $project: { _id: 1 } },
              ],
              as: "isFollow",
            },
          },
          {
            $addFields: {
              isFollow: {
                $cond: {
                  if: { $gt: [{ $size: "$isFollow" }, 0] },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $lookup: {
              from: "Votes",
              let: { postId: "$_id", userId: userId },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$postsId", "$$postId"] },
                        { $eq: ["$userId", "$$userId"] },
                      ],
                    },
                  },
                },
                { $project: { vote: 1 } },
              ],
              as: "votes",
            },
          },
          {
            $addFields: {
              votes: { $first: "$votes.vote" },
            },
          },
          { $sort: { createdAt: -1 } },
        ]);
      }
      if (!posts) {
        throw new CustomError(204, "Không tìm thấy bài viết");
      }
      return posts;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
}

export default new PostsService();
