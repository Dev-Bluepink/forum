import mongoose, { Schema, model } from "mongoose";
import ThreadsModel from "./ThreadsModel";

export interface ICatogeries {
  _id: mongoose.Types.ObjectId;
  provinceId: mongoose.Types.ObjectId;
  name: string;
  image: string;
  isDelete: boolean;
  path: string;
}

const CategoriesSchema: Schema = new Schema<ICatogeries>(
  {
    provinceId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, reiquired: true },
    isDelete: { type: Boolean, required: true, default: false },
    path: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
CategoriesSchema.pre("save", async function (next) {
  if (this.isModified("isDelete") && this.isDelete) {
    await ThreadsModel.updateMany({ categoryId: this._id }, { isDelete: true });
  }
  next();
});
const CategoriesModel = model("Categories", CategoriesSchema);
export default CategoriesModel;
