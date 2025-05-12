import express from "express";

import AuthController from "../controllers/auth.controller";
import { authentication } from "../middlewares/authentication";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/verify-otp", AuthController.verifyOTP);

// Protected routes
router.get("/me", authentication, AuthController.getMe);
router.put("/me", authentication, AuthController.updateMe);

export default router;
