import mongoose from "mongoose";

export interface IReport {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  threadId: mongoose.Types.ObjectId;
  reason: string;
  status: string;
}

const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "Users" },
  postId: { type: mongoose.Types.ObjectId, ref: "Posts" },
  threadId: { type: mongoose.Types.ObjectId, ref: "Threads" },
  reason: { type: String },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "rejected"],
  },
});

export default mongoose.model("Reports", ReportSchema);
