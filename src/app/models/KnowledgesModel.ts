import mongoose, { Schema, model } from "mongoose";

interface IKnowledge {
  _id: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  title: string;
  image1: string;
  description1: string;
  image2: string;
  description2: string;
  image3: string;
  description3: string;
  image4: string;
  description4: string;
  image5: string;
  description5: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
