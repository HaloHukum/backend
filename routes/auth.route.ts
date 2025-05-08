import { Router } from "express";

import AuthController from "../controllers/auth.controller";
import { authentication } from "../middlewares/auth.middleware";

const router = Router()

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Protected routes
router.get("/me", authentication, AuthController.getMe);
router.put("/me", authentication, AuthController.updateMe);

export default router;
