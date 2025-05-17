import express, { RequestHandler } from "express";

import ReviewController from "../controllers/review.controller";
import { authentication } from "../middlewares/auth.middleware";


const router = express.Router();

router.use(authentication);

router.post("/", ReviewController.createReview as RequestHandler);
router.get("/", ReviewController.getReviews as RequestHandler);
router.get("/:id", ReviewController.getReviewById as RequestHandler);
router.delete("/:id", ReviewController.deleteReview as RequestHandler);

export default router;
