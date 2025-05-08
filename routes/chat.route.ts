import { Router } from "express";

import ChatController from "../controllers/chat.controller";
import { authentication } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authentication, ChatController.createChannel);

export default router;
