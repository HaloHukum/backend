import { Document } from "mongoose";

export interface ICategory extends Document {
  title: string;
  description: string;
  subCategories: string[];
  createdAt: Date;
  updatedAt: Date;
}
