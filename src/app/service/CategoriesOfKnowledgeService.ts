import CategoriesOfKnowledgeModel from "../models/CategoriesOfKnowledgeModel";
import CustomError from "../utils/customError";

class CategoriesOfKnowledgeService {
  async getCategoriesOfKnowledge() {
    try {
      const categoriesOfKnowledge = await CategoriesOfKnowledgeModel.find({
        isDelete: false,
      });
      if (!categoriesOfKnowledge) {
        throw new CustomError(204, "Categories of knowledge not found");
      }
      return categoriesOfKnowledge;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async createCategoriesOfKnowledge(data: { name: string; image: string }) {
    try {
      const check = await CategoriesOfKnowledgeModel.findOne({
        name: data.name,
      });
      if (check) {
        throw new CustomError(400, "Đã tồn tại danh mục này");
      }
      const categoriesOfKnowledge = await CategoriesOfKnowledgeModel.create(
        data
      );
      return categoriesOfKnowledge;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async softDeleteCategoriesOfKnowledge(id: string) {
    try {
      const categoriesOfKnowledge =
        await CategoriesOfKnowledgeModel.findByIdAndUpdate(id, {
          isDelete: true,
        });
      if (!categoriesOfKnowledge) {
        throw new CustomError(204, "Danh mục không tồn tại");
      }
      return categoriesOfKnowledge;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
}

export default new CategoriesOfKnowledgeService();
