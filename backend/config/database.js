import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGODB_URI;

export async function initDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB:", MONGO_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

export { mongoose }; // ✅ notice this line (named export)
