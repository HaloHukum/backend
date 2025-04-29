import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  phone: string;
  password: string;
  birthdate?: string;
  gender?: "male" | "female";
  role: "client" | "lawyer" | "admin";
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}
