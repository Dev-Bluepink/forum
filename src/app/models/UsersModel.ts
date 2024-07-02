import mongoose, { Schema, model } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  phone_number: string;
  birthday: string;
  points: number;
  fullname: string;
  googleId: string;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    avatar: { type: String, required: false },
    city: { type: String, required: false },
    district: { type: String, required: false },
    ward: { type: String, required: false },
    street: { type: String, required: false },
    phone_number: { type: String, required: false },
    birthday: { type: String, required: false },
    points: { type: Number, required: true, default: 0 },
    fullname: { type: String, required: false },
    googleId: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUser>("Users", UserSchema);
export default UserModel;
