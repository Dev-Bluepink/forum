import CategoriesModel from "../models/CategoriesModel";
import CustomError from "../utils/customError";

class CategoriesService {
  async addCategory(provinceId: string, name: string) {
    try {
      const checkCategory = await CategoriesModel.findOne({ provinceId, name });
      if (checkCategory) {
        throw new CustomError(400, "Danh mục này đã tồn tại trong khu vực");
      }
      const category = await CategoriesModel.create({ provinceId, name });
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
  async deleteCategory(id: string) {
    try {
      const checkDelete = await CategoriesModel.findById(id);
      if (!checkDelete) {
        throw new CustomError(500, "Không tìm thấy danh mục cần xóa");
      }
      const update = { isDeleted: !checkDelete.isDeleted };
      const deleteCategory = await CategoriesModel.findByIdAndUpdate(
        id,
        update,
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
  async getAllCategories(page: number, limit: number, provinceId?: string) {
    try {
      const filter = provinceId ? { provinceId } : {};
      const categories = await CategoriesModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit);
      if (!categories) {
        throw new CustomError(204, "Không tìm thấy danh mục nào!!");
      }
      return categories;
    } catch (error) {}
  }

  async countCategories(provinceId?: string) {
    try {
      const filter = provinceId ? { provinceId } : {};
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
}

export default new CategoriesService();
