import mongoose from "mongoose";
let isConnected = false;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("please define MONGO_URI in env file ");
}

export const connectToDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("mongoDB connection successfull");
  } catch (error: any) {
    console.error("MongDB connection error : ", error.message);
  }
};
