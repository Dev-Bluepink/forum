import ProvincesService from "../service/ProvincesService";
import { Request, Response } from "express";
import CustomError from "../utils/customError";
import ProvincesModel from "../models/ProvincesModel";

class ProvincesController {
  async addProvince(req: Request, res: Response) {
    try {
      const { province } = req.body;

      if (!province || Object.keys(province).length === 0) {
        throw new CustomError(400, "Vui lòng nhập tên tỉnh muốn thêm");
      }
      const newProvince = await ProvincesService.addProvince(province);
      res.status(201).json(newProvince);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).send("Lỗi máy chủ: " + error);
      }
    }
  }
  async getAllProvinces(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const PAGE_SIZE = req.query.PAGE_SIZE
        ? parseInt(req.query.PAGE_SIZE as string)
        : 10;
      const province = await ProvincesService.getAllProvinces(page, PAGE_SIZE);
      const count = await ProvincesService.countProvince();
      const totalPage = Math.ceil(count / PAGE_SIZE);
      console.log(count);
      console.log(totalPage);

      res.status(200).json({ count, totalPage, province });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).send("Lỗi máy chủ: " + error);
      }
    }
  }
  async changeStatusProvince(req: Request, res: Response) {
    try {
      const { provinceId } = req.body;
      if (!provinceId) {
        throw new CustomError(400, "Vui lòng truyền Id của tỉnh thành");
      }
      const pronvince = await ProvincesService.changeStatusProvince(provinceId);
      res.status(200).send(pronvince);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).send("Lỗi máy chủ: " + error);
      }
    }
  }
}

export default new ProvincesController();
