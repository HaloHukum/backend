import { Types } from "mongoose";
import { Document } from "mongoose";
import { z } from "zod";

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  city: string;
  gender: "male" | "female";
  role: "client" | "lawyer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  dateOfBirth: z.coerce.date({ invalid_type_error: "Invalid or missing date" }),
  city: z.string().min(1, "City is required"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender must be 'male' or 'female'" }),
  }),
  role: z.enum(["client", "lawyer", "admin"]).optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});
