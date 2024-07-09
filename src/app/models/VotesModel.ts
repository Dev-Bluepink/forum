import mongoose, { Schema, model } from "mongoose";

export interface IVotes {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  postsId: mongoose.Types.ObjectId;
  vote: string;
}
const VotesSchema: Schema = new Schema<IVotes>({
  userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  postsId: { type: Schema.Types.ObjectId, ref: "Posts", required: true },
  vote: { type: String, enum: ["up", "none", "down"], required: true },
});

const VotesModel = model("Votes", VotesSchema);
export default VotesModel;
