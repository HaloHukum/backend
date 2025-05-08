import express from "express";

import authRoutes from "./auth.route";
import chatRoutes from "./chat.route";  
import consultationRoutes from "./consultation.route";
import lawyerRoutes from "./lawyer.route";
import userRoutes from "./user.route";

const router = express.Router();

router.use("/", authRoutes);
router.use("/users", userRoutes);
router.use("/lawyers", lawyerRoutes);
router.use("/consultations", consultationRoutes);
router.use("/chats", chatRoutes);

export default router;
