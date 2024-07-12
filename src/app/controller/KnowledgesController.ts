import { Request, Response } from "express";
import PostsService from "../service/PostsService";
import CustomError from "../utils/customError";

class KnowledgesController {
  async createKnowledge(req: Request, res: Response) {
    try {
      const {
        userId,
        title,
        content,
        categoryId,
        content1,
        content2,
        content3,
        content4,
        content5,
      } = req.body;
      const image = req.cloudinaryUrls || [];
      const image1 = image.length > 0 ? image[0] : null;
      const image2 = image.length > 1 ? image[1] : null;
      const image3 = image.length > 2 ? image[2] : null;
      const image4 = image.length > 3 ? image[3] : null;
      const image5 = image.length > 4 ? image[4] : null;
      const path = "knowledge";
      let info: {};
      info = {
        userId,
        title,
        content,
        categoryId,
        image1,
        image2,
        image3,
        image4,
        image5,
        content1,
        content2,
        content3,
        content4,
        content5,
        path,
      };
      const knowledge = await PostsService.addPost(info);
      res.status(201).json(knowledge);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.status).send(error.message);
      } else {
        res.status(500).send("Lỗi máy chủ: " + error);
      }
    }
  }
}

export default new KnowledgesController();
