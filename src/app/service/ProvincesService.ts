import ProvincesModel from "../models/ProvincesModel";
import CustomError from "../utils/customError";

class ProvincesService {
  async addProvince(name: string) {
    try {
      const checkProvince = await ProvincesModel.findOne({ name });
      if (checkProvince) {
        throw new CustomError(400, "Tỉnh này đã tồn tại");
      }
      const province = await ProvincesModel.create(name);
      if (!province) {
        throw new CustomError(500, "Lỗi khi tạo mới tỉnh thành");
      }
      return province;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async deleteProvince(id: string) {
    try {
      const province = await ProvincesModel.findById(id);
      if (!province) {
        throw new CustomError(
          500,
          "lỗi khi tìm kiếm tỉnh thành để thay đổi trạng thái"
        );
      }
      const update = { isDelete: !province.status };
      const deleteProvince = await ProvincesModel.findByIdAndUpdate(
        id,
        update,
        { new: true }
      );
      return deleteProvince;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async getAllProvinces(page: number, limit: number) {
    try {
      const provinces = await ProvincesModel.find()
        .skip((page - 1) * limit)
        .limit(limit);
      if (!provinces || provinces.length === 0) {
        throw new CustomError(204, "Không tìm thấy tỉnh nào");
      }
      return provinces;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  async countProvince() {
    try {
      const provinces = await ProvincesModel.countDocuments();
      if (provinces < 1) {
      }
    } catch (error) {}
  }
}

export default new ProvincesService();
