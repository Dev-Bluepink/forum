import { v2 as cloudinary } from "cloudinary";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = upload.single("image");

// Mở rộng kiểu Request để thêm thuộc tính cloudinaryUrl
declare global {
  namespace Express {
    export interface Request {
      cloudinaryUrl?: string;
      cloudinaryUrls?: string[];
    }
  }
}

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadToCloudinary(req, res, function (err) {
    if (err) {
      return res.status(500).json({ message: "Lỗi khi tải Ảnh" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Không có Ảnh được tải lên" });
    }

    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ error: "Lỗi khi tải ảnh lên Cloudinary." });
        }
        req.cloudinaryUrl = result!.url; // Lưu URL của ảnh vào req để sử dụng ở các middleware tiếp theo
        next();
      })
      .end(req.file.buffer);
  });
};

export const uploadImageToUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadToCloudinary(req, res, function (err) {
    if (err) {
      return res.status(500).json({ message: "Lỗi khi tải Ảnh" });
    }
    if (!req.file) {
      return next();
    }

    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ error: "Lỗi khi tải ảnh lên Cloudinary." });
        }
        req.cloudinaryUrl = result!.url; // Lưu URL của ảnh vào req để sử dụng ở các middleware tiếp theo
        next();
      })
      .end(req.file.buffer);
  });
};

export const uploadImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadToCloudinary(req, res, async function (err) {
    // Thêm async ở đây
    if (err) {
      return res.status(500).json({ message: "Lỗi khi tải Ảnh" });
    }
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ message: "Không có Ảnh được tải lên" });
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result!.url);
              }
            })
            .end(file.buffer);
        })
    );

    try {
      req.cloudinaryUrls = await Promise.all(uploadPromises); // Lưu URL của các ảnh vào req để sử dụng ở các middleware tiếp theo
      next();
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi tải ảnh lên Cloudinary." });
    }
  });
};
