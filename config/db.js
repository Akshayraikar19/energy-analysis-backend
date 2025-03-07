const mongoose = require("mongoose");


const configureDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

module.exports = configureDB;
