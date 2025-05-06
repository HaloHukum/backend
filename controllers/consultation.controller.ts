import { Request, Response } from "express";

import Consultation from "../models/consultation.model";

class ConsultationController {
  static async createConsultation(req: Request, res: Response) {
    try {
      const consultation = new Consultation(req.body);
      const savedConsultation = await consultation.save();
      res.status(201).json(savedConsultation);
    } catch (error) {
      res.status(400).json({ message: "Error creating consultation", error });
    }
  }

  static async getConsultations(req: Request, res: Response) {
    try {
      const { userId, lawyerId, status } = req.query;
      const filter: any = {};

      if (userId) filter.userId = userId;
      if (lawyerId) filter.lawyerId = lawyerId;
      if (status) filter.status = status;

      const consultations = await Consultation.find(filter)
        .populate("userId", "fullName")
        .populate("lawyerId", "fullName");
      res.status(200).json(consultations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching consultations", error });
    }
  }

  static async getConsultation(req: Request, res: Response) {
    try {
      const consultation = await Consultation.findById(req.params.id)
        .populate("userId", "fullName")
        .populate("lawyerId", "fullName");

      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }
      res.status(200).json(consultation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching consultation", error });
    }
  }

  static async updateConsultation(req: Request, res: Response) {
    try {
      const { status, scheduledTime, method } = req.body;
      const updateData: any = {};

      if (status) updateData.status = status;
      if (scheduledTime) updateData.scheduledTime = scheduledTime;
      if (method) updateData.method = method;

      const consultation = await Consultation.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      )
        .populate("userId", "fullName")
        .populate("lawyerId", "fullName");

      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }
      res.status(200).json(consultation);
    } catch (error) {
      res.status(400).json({ message: "Error updating consultation", error });
    }
  }

  static async deleteConsultation(req: Request, res: Response) {
    try {
      const consultation = await Consultation.findByIdAndDelete(req.params.id);
      if (!consultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }
      res.status(200).json({ message: "Consultation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting consultation", error });
    }
  }
}

export default ConsultationController;
