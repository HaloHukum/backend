import { Document, Types } from "mongoose";

export interface IMessage extends Document {
  consultationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  attachmentUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
