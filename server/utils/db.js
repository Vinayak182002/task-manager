const mongoose = require("mongoose");
const URI = process.env.MONGODB_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Database Connected Succesfullly!");
  } catch (error) {
    console.log("Database connection failed!", error);
    process.exit(0);
  }
};
module.exports = connectDB;
