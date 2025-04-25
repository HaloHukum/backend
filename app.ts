import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/mongoose";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "./controllers/userController";

dotenv.config(); // Load .env first!

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to HalloHukum API" });
});

// User routes
app.post("/users", createUser);
app.get("/users", getUsers);
app.get("/users/:id", getUser);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

// Connect to MongoDB and then start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();
