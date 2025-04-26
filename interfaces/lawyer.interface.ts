import { Document, Types } from "mongoose";

export interface ILawyer extends Document {
  userId: Types.ObjectId;
  fullName: string;
  licenseNumber: string;
  specialization: string;
  bio?: string | null;
  profilePicture: string;
  pricePerSession: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
