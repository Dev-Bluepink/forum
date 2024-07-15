import CategoriesModel from "../models/CategoriesModel";
import CustomError from "../utils/customError";
import mongoose from "mongoose";

class CategoriesService {
  async addCategory(
    provinceId: string,
    name: string,
    image: string,
    path: string
  ) {
    try {
      const checkCategory = await CategoriesModel.findOne({ provinceId, name });
      if (checkCategory) {
        throw new CustomError(400, "Danh mục này đã tồn tại trong khu vực");
      }
      const category = await CategoriesModel.create({
        provinceId,
        name,
        image,
        path,
      });
      if (!category) {
        throw new CustomError(500, "Lỗi khi tạo mới danh mục");
      }
      return category;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async softDeleteCategory(id: string) {
    try {
      const checkDelete = await CategoriesModel.findById(id);
      if (!checkDelete) {
        throw new CustomError(500, "Không tìm thấy danh mục cần xóa");
      }
      const deleteCategory = await CategoriesModel.findByIdAndUpdate(
        id,
        { isDelete: true },
        { new: true }
      );
      return deleteCategory;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async getAllCategories(page: number, PAGE_SIZE: number, provinceId?: string) {
    try {
      const filter = provinceId
        ? {
            provinceId: new mongoose.Types.ObjectId(provinceId),
            isDelete: false,
          }
        : {};
      // const categories = await CategoriesModel.find(filter)
      //   .skip((page - 1) * limit)
      //   .limit(limit);
      const categories = await CategoriesModel.aggregate([
        {
          $match: filter,
        },
        {
          $skip: (page - 1) * PAGE_SIZE,
        },
        {
          $limit: PAGE_SIZE,
        },
        {
          $lookup: {
            from: "threads",
            localField: "_id",
            foreignField: "threadId",
            as: "threads",
            pipeline: [{ $match: { isDelete: false } }],
          },
        },
        { $addFields: { numThreads: { $size: "$threads" } } },
        { $sort: { updatedAt: -1 } },
        {
          $project: {
            _id: 1,
            name: 1,
            image: 1,
            numThreads: 1,
          },
        },
      ]);
      if (!categories) {
        throw new CustomError(204, "Không tìm thấy danh mục nào!!");
      }
      return categories;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }

  async countCategories(provinceId?: string) {
    try {
      const filter = provinceId ? { provinceId, isDelete: false } : {};
      const count = await CategoriesModel.countDocuments(filter);
      if (!count) {
        throw new CustomError(204, "Lỗi khi đếm tổng số danh mục");
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
  async findCategoryById(id: string) {
    try {
      const categogy = await CategoriesModel.findById(id);
      if (!categogy) {
        throw new CustomError(204, "Lỗi không tìm thấy danh mục bằng ID ");
      }
      return categogy;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
}

export default new CategoriesService();
