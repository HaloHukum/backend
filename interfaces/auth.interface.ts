import { z } from "zod";

import { IUser } from "./user.interface";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export interface RegisterPayload {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  city: string;
  gender: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface PreAuthResponse {
  email?: string;
  message?: string;
}

// export interface RegisterResponse {
//   fullName: string;
//   email: string;
//   role: string;
// }

export interface PostAuthResponse {
  access_token: string;
  token_type: string;
  chat_token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

export const registerValidation = z.object({
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

export const loginValidation = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});
