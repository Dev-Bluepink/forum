import * as mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://devbluepink:g3etGqWP4YJO2CXn@forum.2nzb0qa.mongodb.net/forum"
    );
    console.log("Truy cập DB thành công!");
  } catch (error) {
    console.log("Truy cập DB thất bại!!!!");
  }
}
