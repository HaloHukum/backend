import { Request, Response } from "express";
import UserService from "../services/user.service";

export default class UserController {
  // Create a new user
  static async createUser(req: Request, res: Response) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error("createUser error:", error);
      res.status(400).json({ error: "Error creating user" });
    }
  }

  // Get all users
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getUsers();
      res.json(users);
    } catch (error) {
      console.error("getUsers error:", error);
      res.status(500).json({ error: "Error fetching users" });
    }
  }

  // Get a single user by ID
  static async getUser(req: Request, res: Response) {
    try {
      const user = await UserService.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("getUser error:", error);
      res.status(500).json({ error: "Error fetching user" });
    }
  }

  // Update a user
  static async updateUser(req: Request, res: Response) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (_error) {
      res.status(400).json({ error: "Error updating user" });
    }
  }

  // Delete a user
  static async deleteUser(req: Request, res: Response) {
    try {
      const user = await UserService.deleteUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (_error) {
      res.status(500).json({ error: "Error deleting user" });
    }
  }
}
