import ProvincesModel from "../models/ProvincesModel";
import CustomError from "../utils/customError";

class ProvincesService {
  async addProvince(name: string) {
    try {
      const checkProvince = await ProvincesModel.findOne({ name });
      console.log("Đã tới đây");
      if (checkProvince) {
        throw new CustomError(400, "Tỉnh này đã tồn tại");
      }
      console.log("Đã tới đây");
      const province = await ProvincesModel.create({ name });

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
  async changeStatusProvince(id: string) {
    try {
      const province = await ProvincesModel.findById(id);
      if (!province) {
        throw new CustomError(
          204,
          "lỗi khi tìm kiếm tỉnh thành để thay đổi trạng thái"
        );
      }
      const isDelete = province.isDelete;
      const update = { isDelete: !isDelete };

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
  async getAllProvinces(page: number, PAGE_SIZE: number) {
    try {
      // const provinces = await ProvincesModel.find({ isDelete: false })
      //   .skip((page - 1) * PAGE_SIZE)
      //   .limit(PAGE_SIZE);
      const provinces = await ProvincesModel.aggregate([
        { $match: { isDelete: false } },
        {
          $skip: (page - 1) * PAGE_SIZE,
        },
        {
          $limit: PAGE_SIZE,
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "provinceId",
            as: "categories",
            pipeline: [
              { $match: { isDelete: false } },
              {
                $lookup: {
                  from: "threads",
                  localField: "_id",
                  foreignField: "categoryId",
                  as: "threads",
                  pipeline: [{ $match: { isDelete: false, status: "Accept" } }],
                },
              },
            ],
          },
        },
        { $addFields: { numCategories: { $size: "$categories" } } },
        // { $unwind: "$categories" },
        // { $unwind: "$categories.threads" },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            numCategories: { $first: "$numCategories" },
            totalParticipants: {
              $sum: {
                $cond: [
                  {
                    $eq: [{ $type: "$categories.threads.userId" }, "objectId"],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        { $sort: { name: -1 } },
        {
          $project: {
            _id: 1,
            name: 1,
            numCategories: 1,
            totalParticipants: 1,
          },
        },
      ]);

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
      const provinces = await ProvincesModel.countDocuments({
        isDelete: false,
      });
      if (!provinces) {
        throw new CustomError(400, "Lỗi khi đếm tổng số tỉnh thành");
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
  async findProvinceById(id: string) {
    try {
      const province = await ProvincesModel.findById(id);
      if (!province) {
        throw new CustomError(204, "Lỗi không tìm thấy tỉnh thành");
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
}

export default new ProvincesService();
