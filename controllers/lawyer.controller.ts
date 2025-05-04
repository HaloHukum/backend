import { Request, Response } from "express";

import Lawyer from "../models/lawyer.model";

class LawyerController {
  static async createLawyer(req: Request, res: Response) {
    try {
      const lawyer = new Lawyer(req.body);
      const savedLawyer = await lawyer.save();
      res.status(201).json(savedLawyer);
    } catch (error) {
      res.status(400).json({ message: "Error creating lawyer", error });
    }
  }

  static async getLawyers(req: Request, res: Response) {
    try {
      const lawyers = await Lawyer.find();
      res.status(200).json(lawyers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching lawyers", error });
    }
  }

  static async getLawyer(req: Request, res: Response) {
    try {
      const lawyer = await Lawyer.findById(req.params.id);
      if (!lawyer) {
        return res.status(404).json({ message: "Lawyer not found" });
      }
      res.status(200).json(lawyer);
    } catch (error) {
      res.status(500).json({ message: "Error fetching lawyer", error });
    }
  }

  static async updateLawyer(req: Request, res: Response) {
    try {
      const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!lawyer) {
        return res.status(404).json({ message: "Lawyer not found" });
      }
      res.status(200).json(lawyer);
    } catch (error) {
      res.status(400).json({ message: "Error updating lawyer", error });
    }
  }
}

export default LawyerController;
