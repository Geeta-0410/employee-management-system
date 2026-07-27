import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    console.error("DB Error:", message);

    process.exit(1);

    console.log("MONGO_URI =", process.env.MONGO_URI);
  }
};

export default connectDB;
