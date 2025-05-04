import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { IUser } from "../interfaces/user.interface";

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export default class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      return res.status(201).json(result);
    } catch (error) {
      console.error("register error:", error);
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          return res.status(400).json({ errors: errorData });
        } catch {
          return res.status(500).json({ error: "Error during register" });
        }
      }
      return res.status(500).json({ error: "Error during register" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("login error:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid email/password") {
          return res.status(401).json({ error: error.message });
        }
        try {
          const errorData = JSON.parse(error.message);
          return res.status(400).json({ errors: errorData });
        } catch {
          return res.status(500).json({ error: "Error during login" });
        }
      }
      return res.status(500).json({ error: "Error during login" });
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await AuthService.getMe(userId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("getMe error:", error);
      if (error instanceof Error && error.message === "User not found") {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error getting user profile" });
    }
  }

  static async updateMe(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await AuthService.updateMe(userId, req.body);
      return res.status(200).json(result);
    } catch (error) {
      console.error("updateMe error:", error);
      if (error instanceof Error) {
        if (error.message === "User not found") {
          return res.status(404).json({ error: error.message });
        }
        if (error.message === "Failed to update user") {
          return res.status(400).json({ error: error.message });
        }
        try {
          const errorData = JSON.parse(error.message);
          return res.status(400).json({ errors: errorData });
        } catch {
          return res.status(500).json({ error: "Error updating user profile" });
        }
      }
      return res.status(500).json({ error: "Error updating user profile" });
    }
  }
}
