const mongoose = require("mongoose");
require("dotenv").config();

async function checkDatabase() {
  console.log("Connecting to:", process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
    
    // Check connection state
    const state = mongoose.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    console.log(`Connection state: ${states[state]}`);

    // Try a simple operation (e.g., list collections)
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Available collections: ${collections.map(c => c.name).join(", ") || "none"}`);
    
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (err) {
    console.error("❌ MongoDB connection error:");
    console.error(err.message);
    process.exit(1);
  }
}

checkDatabase();