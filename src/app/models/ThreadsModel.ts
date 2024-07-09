import mongoose, { Schema, model } from "mongoose";
import PostsModel from "./PostsModel";

export interface IThread {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  status: string;
  isDelete: boolean;
  title: string;
  path: string;
  follow: number;
}

const ThreadsSchema = new Schema<IThread>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    title: { type: String, required: true },
    path: { type: String, required: true },
    follow: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["Accept", "Pending", "Reject"],
      default: "Pending",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ThreadsSchema.pre("save", async function (next) {
  if (this.isModified("isDelete")) {
    await PostsModel.updateMany(
      { threadId: this._id },
      { isDelete: this.isDelete }
    );
  }
  next();
});

const ThreadsModel = model<IThread>("Threads", ThreadsSchema);
export default ThreadsModel;
