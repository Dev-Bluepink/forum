import mongoose, { Schema, model } from "mongoose";

export interface IComments {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  commentId: mongoose.Types.ObjectId;
  content: string;
  isDeleted: boolean;
}

const CommentSchema = new Schema<IComments>({
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
  postId: { type: Schema.Types.ObjectId, ref: "Posts" },
  commentId: { type: Schema.Types.ObjectId, ref: "Comments" },
  content: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

const CommentsModel = model<IComments>("Comments", CommentSchema);

export default CommentsModel;
