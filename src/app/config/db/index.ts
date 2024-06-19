import * as mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://duocnnbluepink:nxsMiwVIwpryFxHo@typescript.ejti578.mongodb.net/quizz"
    );
    console.log("Truy cập DB thành công!");
  } catch (error) {
    console.log("Truy cập DB thất bại!!!!");
  }
}
