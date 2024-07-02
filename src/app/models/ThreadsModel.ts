import mongoose, { Schema, model } from "mongoose";

export interface IThread {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  status: string;
  title: string;
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
    status: {
      type: String,
      enum: ["Accept", "Pending", "Reject"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const ThreadsModel = model<IThread>("Threads", ThreadsSchema);
export default ThreadsModel;
