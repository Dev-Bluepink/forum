import mongoose, { Schema, model } from "mongoose";

export interface IComments {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  commentId: mongoose.Types.ObjectId;
  content: string;
  isDeleted: boolean;
}

const CommentSchema = new Schema<IComments>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  content: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

const CommentsModel = model<IComments>("Comments", CommentSchema);

export default CommentsModel;
