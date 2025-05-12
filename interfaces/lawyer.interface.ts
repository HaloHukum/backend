import { Document, Types } from "mongoose";

export interface ILawyer extends Document {
  userId: Types.ObjectId;
  specialization: string[];
  yearsOfExperience: number;
  certifications?: string[];
  qualification?: string;
  about?: string;
  image: string;
  isVerified: boolean;
  status: "online" | "offline";
  price: number;
  totalConsults: number;
  createdAt: Date;
  updatedAt: Date;
}
