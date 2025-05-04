import express from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import lawyerRoutes from "./lawyer.route";
import consultationRoutes from "./consultation.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/lawyers", lawyerRoutes);
router.use("/consultations", consultationRoutes);

export default router;
