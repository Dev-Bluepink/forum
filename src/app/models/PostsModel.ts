import mongoose, { Schema, model } from "mongoose";

export interface IPosts {
  _id: mongoose.Types.ObjectId;
  threadId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  tagId: mongoose.Types.ObjectId;
  content: string;
  image: string;
  title: string;
  view: number;
  vote: number;
  path: string;
  status: string;
  isDeleted: boolean;
  countReport: number;
}
const PostSchema: Schema = new Schema<IPosts>({
  threadId: { type: Schema.Types.ObjectId, ref: "Threads", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  tagId: { type: Schema.Types.ObjectId, ref: "Tags", required: true },
  content: { type: String, required: true },
  image: { type: String, required: false },
  title: { type: String, required: true },
  view: { type: Number, required: true, default: 0 },
  vote: { type: Number, required: true, default: 0 },
  path: { type: String, required: true },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
  },
  isDeleted: { type: Boolean, default: false },
  countReport: { type: Number, default: 0 },
});

const PostsModel = model("Posts", PostSchema);
export default PostsModel;
