import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(
      `❌ Error connecting to MongoDB: ${(error as Error).message}`,
    );
    process.exit(1); // Stop the app if we can't connect to the DB
  }
};

export default connectDB;
