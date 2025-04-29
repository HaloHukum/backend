import { Request, Response } from "express";
import User from "../models/user";
import { comparePassword } from "../helpers/bcrypt";
import { signToken } from "../helpers/jwt";

export default class AuthController {
  // Sequelize
  static async register(req: Request, res: Response) {
    //* 1. POST /register
    try {
      const { email, password, username, phone, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Email or username already exists" });
      }

      const user = await User.create({
        email,
        password,
        username,
        phone,
        role: role || "client",
      });

      res.status(201).json({
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      });
    } catch (error) {
      console.error("register error:", error);
      res.status(500).json({ error: "Error during register" });
    }
  }

  // Sequelize
  static async login(req: Request, res: Response) {
    //* 2. POST /login
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email/password" });
      }

      const isValidatePassword = comparePassword(password, user.password);
      if (!isValidatePassword) {
        return res.status(401).json({ error: "Invalid email/password" });
      }

      const access_token = signToken({ id: user._id });

      res.status(200).json({
        access_token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("login error:", error);
      res.status(500).json({ error: "Error during login" });
    }
  }
}
