import { Document, Types } from "mongoose";

export interface IConsultation extends Document {
  userId: Types.ObjectId;
  lawyerId: Types.ObjectId;
  method: "chat" | "call" | "video";
  status: "scheduled" | "completed" | "canceled";
  scheduledTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}
