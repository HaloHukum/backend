import { Document, Types } from "mongoose";

export interface ILawyer extends Document {
  userId: Types.ObjectId;
  specialization: string;
  firmName: string;
  yearsOfExperience: number;
  certifications?: string[];
  education?: string;
  about?: string;
  image: string;
  isVerified: boolean;
  status: "active" | "inactive" | "pending";
  price: number;
  totalConsults: number;
  createdAt: Date;
  updatedAt: Date;
}
