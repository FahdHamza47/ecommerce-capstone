import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// ==========================================
// 1. Environment Variables Configuration
// ==========================================
// Load local .env file variables for Jest
dotenv.config();

// Ensure JWT_SECRET and NODE_ENV are explicitly set for test runs
process.env.JWT_SECRET =
  process.env.JWT_SECRET || "this_is_a_super_secret_key_change_it_later";
process.env.NODE_ENV = "test";

// ==========================================
// 2. Database Memory Server Utilities
// ==========================================
let mongoServer: MongoMemoryServer;

// Runs once before all tests in a file that imports this
export const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

// Runs once after all tests in a file that imports this
export const closeTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

// Runs between individual tests to reset data (keeps tests independent of each other)
export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
