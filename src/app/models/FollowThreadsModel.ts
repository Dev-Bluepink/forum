import mongoose, { Schema, model } from "mongoose";

export interface IFollowThreads {
  userId: mongoose.Types.ObjectId;
  threadId: mongoose.Types.ObjectId;
  isFollow: boolean;
}
const FollowThreadsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  threadId: { type: Schema.Types.ObjectId, ref: "Thread", required: true },
  isFollow: { type: Boolean, default: true },
});

const FollowThreadsModel = model<IFollowThreads>(
  "FollowThreads",
  FollowThreadsSchema
);

export default FollowThreadsModel;
