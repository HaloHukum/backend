import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./configs/mongoose.config";
import routes from "./routes/route";

dotenv.config(); // Load .env first!

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to HalloHukum API" });
});

app.use("/", routes);

// Connect to MongoDB and then start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();
