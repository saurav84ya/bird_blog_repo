import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URL;

export async function connect() {
  if (!MONGO_URI) {
    console.error("❌ MongoDB connection string is missing!");
    process.exit(1);
  }

  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("⚡ Using existing MongoDB connection");
      return;
    }

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // ⬅ Increase timeout (default is 10000ms)
      connectTimeoutMS: 30000, // ⬅ Connection timeout
    });

    const connection = mongoose.connection;

    connection.on("connected", () => console.log("✅ MongoDB connected successfully"));
    connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Something went wrong while connecting to MongoDB:", error);
    process.exit(1);
  }
}
