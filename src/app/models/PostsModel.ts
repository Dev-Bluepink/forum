import mongoose, { Schema, model } from "mongoose";

export interface IPosts {
  _id: mongoose.Types.ObjectId;
  threadId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
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
  countComments: number;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  content1: string;
  content2: string;
  content3: string;
  content4: string;
  content5: string;
}
const PostSchema: Schema = new Schema<IPosts>({
  threadId: { type: Schema.Types.ObjectId, ref: "Threads", required: false },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "CategoriesOfKnowledges",
    required: false,
  },
  userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  tagId: { type: Schema.Types.ObjectId, ref: "Tags", required: false },
  content: { type: String, required: false },
  image: { type: String, required: false },
  title: { type: String, required: false },
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
  countComments: { type: Number, default: 0 },
  image1: { type: String, required: false },
  image2: { type: String, required: false },
  image3: { type: String, required: false },
  image4: { type: String, required: false },
  image5: { type: String, required: false },
  content1: { type: String, required: false },
  content2: { type: String, required: false },
  content3: { type: String, required: false },
  content4: { type: String, required: false },
  content5: { type: String, required: false },
});

const PostsModel = model("Posts", PostSchema);
export default PostsModel;
