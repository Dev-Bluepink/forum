import mongoose, { Schema, model } from "mongoose";

export interface ISavePosts {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  postsId: mongoose.Types.ObjectId;
  isDelete: boolean;
}

const SavePostsSchema: Schema = new Schema<ISavePosts>({
  userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  postsId: { type: Schema.Types.ObjectId, ref: "Posts", required: true },
  isDelete: { type: Boolean, default: false, required: true },
});

const SavePostsModel = model<ISavePosts>("SavePosts", SavePostsSchema);

export default SavePostsModel;
