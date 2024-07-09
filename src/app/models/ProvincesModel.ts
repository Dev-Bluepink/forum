import mongoose, { Schema, model } from "mongoose";
import CategoriesModel from "./CategoriesModel";

export interface IProvince {
  _id: mongoose.Types.ObjectId;
  name: string;
  isDelete: boolean;
}

const ProvincesSchema: Schema = new Schema<IProvince>(
  {
    name: { type: String, reiquired: true },
    isDelete: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

ProvincesSchema.pre("save", async function (next) {
  if (this.isModified("isDelete") && this.isDelete) {
    await CategoriesModel.updateMany(
      { provinceId: this._id },
      { isDelete: true }
    );
  }
  next();
});

const ProvincesModel = model("Provinces", ProvincesSchema);
export default ProvincesModel;
