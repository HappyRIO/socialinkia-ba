const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const MONGO_URI = process.env.DATA_BASE_URL;
// const MONGO_URI = 'mongodb+srv://new:passward@cluster0.fn6dw.mongodb.net/autosocial?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGO_URI) {
  console.log('invalid url')
  throw new Error("MongoDB URI is not set in environment variables");
}

const connectDB = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected!!!");
    return db;
  } catch (err) {
    console.log('connection error exiting with code 1')
    console.error("Database connection error:", err.message);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
