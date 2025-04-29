import { Document } from "mongoose";

export interface ICategory extends Document {
  id: string;
  title: string;
  description: string;
  subCategories: string[];
  createdAt: Date;
  updatedAt: Date;
}
