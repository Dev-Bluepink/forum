import TagsModel from "../models/TagsModel";
import CustomError from "../utils/customError";

class TagsService {
  async createTag(name: string) {
    try {
      const checkTag = await TagsModel.findOne({
        name: name,
      });
      if (checkTag) {
        throw new CustomError(400, "Tag đã tồn tại");
      }
      const tag = await TagsModel.create({ name: name });
      if (!tag) {
        throw new CustomError(500, "Lỗi khi tạo mới tag");
      }
      return tag;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async getAllTags() {
    try {
      const tags = await TagsModel.find({ isDelete: false });
      console.log(tags);

      if (!tags) {
        throw new CustomError(500, "Lỗi khi tìm kiếm các tag ");
      }
      return tags;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async softDeleteTag(id: string) {
    try {
      const tag = await TagsModel.findById(id);
      if (!tag) {
        throw new CustomError(400, "Lỗi khi tìm kiếm tag để xóa");
      }
      tag.isDelete = true;
      tag.save();
      return tag;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
}

export default new TagsService();
