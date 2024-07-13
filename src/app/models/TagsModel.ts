import mongoose, { model, Schema } from "mongoose";

export interface ITag {
  _id: mongoose.Types.ObjectId;
  name: string;
  isDelete: boolean;
}

const TagsSchema = new Schema<ITag>({
  name: { type: String, required: true },
  isDelete: { type: Boolean, required: true, default: false },
});

const TagsModel = model("Tags", TagsSchema);
export default TagsModel;
