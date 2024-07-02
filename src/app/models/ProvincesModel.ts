import mongoose, { Schema, model } from "mongoose";

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

const ProvincesModel = model("Provinces", ProvincesSchema);
export default ProvincesModel;
