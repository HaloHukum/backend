import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/mongoose";
import UserController from "./controllers/userController";
import LawyerController from "./controllers/lawyerController";
import ConsultationController from "./controllers/consultationController";

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
app.post("/users", UserController.createUser);
app.get("/users", UserController.getUsers);
app.get("/users/:id", UserController.getUser);
app.put("/users/:id", UserController.updateUser);
app.delete("/users/:id", UserController.deleteUser);

// Lawyer routes
app.post("/lawyers", LawyerController.createLawyer);
app.get("/lawyers", LawyerController.getLawyers);
app.get("/lawyers/:id", LawyerController.getLawyer);
app.put("/lawyers/:id", LawyerController.updateLawyer);

// Consultation routes
app.post("/consultations", ConsultationController.createConsultation);
app.get("/consultations", ConsultationController.getConsultations);
app.get("/consultations/:id", ConsultationController.getConsultation);
app.put("/consultations/:id", ConsultationController.updateConsultation);
app.delete("/consultations/:id", ConsultationController.deleteConsultation);

// Connect to MongoDB and then start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

startServer();
