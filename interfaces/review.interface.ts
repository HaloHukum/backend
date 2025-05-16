import { Document } from "mongoose";

export interface IReview extends Document {
  userId: string;
  lawyerId: string;
  rating: number;
  date: Date;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
