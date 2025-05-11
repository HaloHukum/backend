import { Types } from "mongoose";

import { IConsultation } from "../interfaces/consultation.interface";
import Consultation from "../models/consultation.model";

export default class ConsultationService {
  static async createConsultation(
    consultationData: Partial<IConsultation>
  ): Promise<IConsultation> {
    const consultation = new Consultation(consultationData);
    return await consultation.save();
  }

  static async getConsultations(filters: {
    userId?: string;
    lawyerId?: string;
    status?: string;
  }): Promise<IConsultation[]> {
    const filter: any = {};

    if (filters.userId) filter.userId = new Types.ObjectId(filters.userId);
    if (filters.lawyerId)
      filter.lawyerId = new Types.ObjectId(filters.lawyerId);
    if (filters.status) filter.status = filters.status;

    return await Consultation.find(filter)
      .populate("userId", "fullName")
      .populate("lawyerId", "fullName")
      .sort({ createdAt: -1 });
  }

  static async getConsultationById(id: string): Promise<IConsultation | null> {
    return await Consultation.findById(id)
      .populate("userId", "fullName")
      .populate("lawyerId", "fullName");
  }

  static async updateConsultation(
    id: string,
    updateData: Partial<IConsultation>
  ): Promise<IConsultation | null> {
    return await Consultation.findByIdAndUpdate(id, updateData, { new: true })
      .populate("userId", "fullName")
      .populate("lawyerId", "fullName");
  }

  static async deleteConsultation(id: string): Promise<IConsultation | null> {
    return await Consultation.findByIdAndDelete(id);
  }

  // Business logic for checking if a consultation belongs to a user or lawyer
  static async isConsultationOwner(
    consultationId: string,
    userId: string,
    isLawyer: boolean = false
  ): Promise<boolean> {
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) return false;

    return isLawyer
      ? consultation.lawyerId.toString() === userId
      : consultation.userId.toString() === userId;
  }
}
