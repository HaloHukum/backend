import { Document } from "mongoose";

export interface ILawyer extends Document {
  name: string;
  qualification: string;
  rating: number;
  areas: string[];
  price: number;
  originalPrice: number;
  image: string;
  isVerified: boolean;
  experience: string;
  consultations: number;
  extraAreas: number;
  certificate: string;
  location: string;
  totalConsults: number;
  education: string;
  about: string;
  reviews: string[];
  status: string;
}
