import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { IConsultation } from "../interfaces/consultation.interface";

dotenv.config();

export function signToken(data: object): string {
  const token = jwt.sign(data, process.env.JWT_SECRET as string);
  return token;
}

export function verifyToken(token: string): string | jwt.JwtPayload {
  const data = jwt.verify(token, process.env.JWT_SECRET as string);
  return data;
}
