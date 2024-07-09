import ReportModel from "../models/ReportModel";
import { IReport } from "../models/ReportModel";
import CustomError from "../utils/customError";

class ReportService {
  async createReport(report: {}) {
    try {
      const newReport = await ReportModel.create(report);
      if (!newReport) {
        throw new CustomError(204, "Lỗi khi tạo báo cáo");
      }
      return newReport;
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new CustomError(500, "Lỗi máy chủ: " + error);
      }
    }
  }
  //pending
  //   async getListReports() {
  //     try {
  //       const reports = await ReportModel.find()
  //         .populate("postId", "title image path")
  //         .populate("threadId", "title")
  //         .populate("userId", "fullname");
  //       if (!reports) {
  //         throw new CustomError(204, "Không tìm thấy báo cáo");
  //       }
  //       return reports;
  //     } catch (error) {
  //       if (error instanceof CustomError) {
  //         throw new CustomError(error.status, error.message);
  //       } else {
  //         throw new CustomError(500, "Lỗi máy chủ: " + error);
  //       }
  //     }
  //   }
}

export default new ReportService();
