import { Document } from "mongoose";

export interface IConsultation extends Document {
  userId: string;
  lawyerId: string;
  categoryId: string;
  caseType: string;
  problemDescription: string;
  legalBasis: string;
  analysis: string;
  conclusionAndAdvice: string;
  chatId: string;
  disclaimer: string;
  expiredAt: string;
  status: "active" | "expired";
  createdAt: Date;
  updatedAt: Date;
}
