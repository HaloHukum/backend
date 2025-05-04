import express from "express";

import LawyerController from "../controllers/lawyer.controller";

const router = express.Router();

router.post("/", LawyerController.createLawyer);
router.get("/", LawyerController.getLawyers);
router.get("/:id", LawyerController.getLawyer);
router.put("/:id", LawyerController.updateLawyer);

export default router;
