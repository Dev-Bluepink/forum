import mongoose, { Schema, model } from "mongoose";

export interface ICategoriesOfKnowledge {
  _id: mongoose.Types.ObjectId;
  name: string;
  image: string;
  isDelete: boolean;
}

const CategoriesOfKnowledgeSchema = new Schema<ICategoriesOfKnowledge>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const CategoriesOfKnowledgeModel = model<ICategoriesOfKnowledge>(
  "CategoriesOfKnowledge",
  CategoriesOfKnowledgeSchema
);

export default CategoriesOfKnowledgeModel;
