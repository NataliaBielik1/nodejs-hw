import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectMongoDB() {
  try {
    const uri = process.env.MONGO_URL;
    if (!uri) {
      throw new Error('MONGO_URL is not defined in .env file');
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB connection established successfully");
  } catch (error) {
    console.error('❌ Failed to connect to db', error);
    process.exit(1);
  }
}
