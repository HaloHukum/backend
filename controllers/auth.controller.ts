import { Request, Response } from "express";

import { IUser } from "../interfaces/user.interface";
import AuthService from "../services/auth.service";

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - phone
 *         - email
 *         - password
 *         - dateOfBirth
 *         - city
 *         - gender
 *       properties:
 *         fullName:
 *           type: string
 *           description: User's full name
 *         phone:
 *           type: string
 *           description: User's phone number
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (min 6 characters)
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *         city:
 *           type: string
 *           description: User's city
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           description: User's gender
 *         role:
 *           type: string
 *           enum: [client, lawyer, admin]
 *           description: User's role (optional)
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *     AuthResponse:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           description: User's full name (for register response)
 *         email:
 *           type: string
 *           description: User's email (for register response)
 *         role:
 *           type: string
 *           description: User's role (for register response)
 *         access_token:
 *           type: string
 *           description: JWT access token (for login response)
 *     UpdateMeRequest:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           description: User's full name
 *         phone:
 *           type: string
 *           description: User's phone number
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *         city:
 *           type: string
 *           description: User's city
 *         gender:
 *           type: string
 *           enum: [male, female]
 *           description: User's gender
 *     VerifyOTPRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         otp:
 *           type: string
 *           description: One-time password received via SMS
 */

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export default class AuthController {
  /**
   * @swagger
   * /register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: object
   *                   description: Validation errors
   *       500:
   *         description: Server error
   */
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

  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Invalid email/password
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: object
   *                   description: Validation errors
   *       500:
   *         description: Server error
   */
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

  /**
   * @swagger
   * /me:
   *   get:
   *     summary: Get current user profile
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   description: User's ID
   *                 fullName:
   *                   type: string
   *                   description: User's full name
   *                 email:
   *                   type: string
   *                   description: User's email
   *                 phone:
   *                   type: string
   *                   description: User's phone number
   *                 dateOfBirth:
   *                   type: string
   *                   format: date
   *                   description: User's date of birth
   *                 city:
   *                   type: string
   *                   description: User's city
   *                 gender:
   *                   type: string
   *                   enum: [male, female]
   *                   description: User's gender
   *                 role:
   *                   type: string
   *                   enum: [client, lawyer, admin]
   *                   description: User's role
   *       401:
   *         description: Unauthorized - User not authenticated
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
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

  /**
   * @swagger
   * /me:
   *   put:
   *     summary: Update current user profile
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateMeRequest'
   *     responses:
   *       200:
   *         description: User profile updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   description: User's ID
   *                 fullName:
   *                   type: string
   *                   description: User's full name
   *                 email:
   *                   type: string
   *                   description: User's email
   *                 phone:
   *                   type: string
   *                   description: User's phone number
   *                 dateOfBirth:
   *                   type: string
   *                   format: date
   *                   description: User's date of birth
   *                 city:
   *                   type: string
   *                   description: User's city
   *                 gender:
   *                   type: string
   *                   enum: [male, female]
   *                   description: User's gender
   *                 role:
   *                   type: string
   *                   enum: [client, lawyer, admin]
   *                   description: User's role
   *       400:
   *         description: Invalid input data or update failed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: object
   *                   description: Validation errors
   *       401:
   *         description: Unauthorized - User not authenticated
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
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

  /**
   * @swagger
   * /verify-otp:
   *   post:
   *     summary: Verify OTP for login
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/VerifyOTPRequest'
   *     responses:
   *       200:
   *         description: OTP verified successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 access_token:
   *                   type: string
   *                   description: JWT access token
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: object
   *                   description: Validation errors
   *       401:
   *         description: Invalid or expired OTP
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Invalid or expired OTP
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
  static async verifyOTP(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const result = await AuthService.verifyOTP(email, otp);
      return res.status(200).json(result);
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error instanceof Error) {
        if (error.message === "Invalid or expired OTP") {
          return res.status(401).json({ error: error.message });
        }
        if (error.message === "User not found") {
          return res.status(404).json({ error: error.message });
        }
        try {
          const errorData = JSON.parse(error.message);
          return res.status(400).json({ errors: errorData });
        } catch {
          return res
            .status(500)
            .json({ error: "Error during OTP verification" });
        }
      }
      return res.status(500).json({ error: "Error during OTP verification" });
    }
  }
}
