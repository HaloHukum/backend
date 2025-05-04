import { Request, Response } from "express";
import User from "../models/user";
import { comparePassword, hashPassword } from "../helpers/bcrypt";
import { signToken } from "../helpers/jwt";
import { loginSchema, registerSchema } from "../interfaces/user.interface";
import { otpService } from "../services/otpService";

export default class AuthController {
  static async register(req: Request, res: Response) {
    //* 1. POST /register
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(400)
          .json({ errors: parsed.error.flatten().fieldErrors });
      }

      const {
        fullName,
        phone,
        email,
        password,
        dateOfBirth,
        city,
        gender,
        role,
      } = parsed.data;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ errors: { email: ["Email already exists"] } });
      }

      const user = await User.create({
        fullName,
        phone,
        email,
        password: hashPassword(password),
        dateOfBirth,
        city,
        gender,
        role: role || "client",
      });

      res.status(201).json({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("register error:", error);
      res.status(500).json({ error: "Error during register" });
    }
  }

  static async login(req: Request, res: Response) {
    //* 2. POST /login
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(400)
          .json({ errors: parsed.error.flatten().fieldErrors });
      }

      const { email, password } = parsed.data;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email/password" });
      }

      const isValidatePassword = comparePassword(password, user.password);
      if (!isValidatePassword) {
        return res.status(401).json({ error: "Invalid email/password" });
      }

      // Generate OTP, store it in Redis, and send it via email
      await otpService.sendOTP(email);

      res.status(200).json({
        message: "OTP has been sent to your email",
        email: email,
      });
    } catch (error) {
      console.error("login error:", error);
      res.status(500).json({ error: "Error during login" });
    }
  }

  static async verifyOTP(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
      }

      const isValidOTP = await otpService.verifyOTP(email, otp);
      if (!isValidOTP) {
        return res.status(401).json({ error: "Invalid or expired OTP" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const access_token = signToken({ id: user._id });
      res.status(200).json({ access_token });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ error: "Error during OTP verification" });
    }
  }
}
