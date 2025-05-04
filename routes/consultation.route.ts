import express from "express";
import ConsultationController from "../controllers/consultation.controller";

const router = express.Router();

router.post("/", ConsultationController.createConsultation);
router.get("/", ConsultationController.getConsultations);
router.get("/:id", ConsultationController.getConsultation);
router.put("/:id", ConsultationController.updateConsultation);
router.delete("/:id", ConsultationController.deleteConsultation);

export default router;
