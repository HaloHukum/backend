import express from "express";

import authRoutes from "./auth.route";
import categoryRoutes from "./category.route";
import chatRoutes from "./chat.route";
import consultationRoutes from "./consultation.route";
import lawyerRoutes from "./lawyer.route";
import reviewRoutes from "./review.route";
import userRoutes from "./user.route";
import callRoutes from "./call.route";

const router = express.Router();

router.use("/", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/chats", chatRoutes);
router.use("/consultations", consultationRoutes);
router.use("/lawyers", lawyerRoutes);
router.use("/reviews", reviewRoutes);
router.use("/users", userRoutes);
router.use("/calls", callRoutes);

export default router;
