require("dotenv").config();
const mongoose = require("mongoose");

function connectDB() {
  // Database connection

  try {
    mongoose.connect(process.env.MONGO_CONNECTION_URL);
    const connection = mongoose.connection;
    connection.once("open", () => {
      console.log("Database connected");
    });
  } catch (error) {
    console.log("Connction Failed.\n", error);
  }
}

module.exports = connectDB;
