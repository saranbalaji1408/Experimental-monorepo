import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import messagesRouter from "./routes/messages";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chat-app";
console.log("Attempting to connect to MongoDB at:", mongoUri);

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
    console.log(
      "Please ensure MongoDB is running and the connection string is correct."
    );
    console.log(
      "You can start MongoDB locally with: brew services start mongodb-community"
    );
    // Don't exit the process, but log a clear message
    console.log(
      "Server will continue running, but database functionality will not work."
    );
  });

// Routes
app.use("/api/messages", messagesRouter);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Chat API" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
