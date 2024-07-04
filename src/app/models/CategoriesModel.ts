import mongoose, { Schema, model } from "mongoose";

export interface ICatogeries {
  _id: mongoose.Types.ObjectId;
  provinceId: mongoose.Types.ObjectId;
  name: string;
  image: string;
  isDelete: boolean;
}

const CategoriesSchema: Schema = new Schema<ICatogeries>(
  {
    provinceId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, reiquired: true },
    isDelete: { type: Boolean, required: true, default: false },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const CategoriesModel = model("Categories", CategoriesSchema);
export default CategoriesModel;
