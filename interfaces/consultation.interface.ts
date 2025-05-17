import { Document, Types } from "mongoose";

export interface IConsultation extends Document {
  userId: Types.ObjectId;
  lawyerId: Types.ObjectId;
  categoryId: string;
  caseType: string;
  problemDescription: string;
  method: "chat" | "call" | "video";
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
