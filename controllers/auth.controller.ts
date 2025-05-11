import { Request, Response } from "express";

import { IUser } from "../interfaces/user.interface";
import AuthService from "../services/auth.service";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

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
 *     LoginResponse:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           description: JWT access token for authentication
 *         token_type:
 *           type: string
 *           enum: [Bearer]
 *           description: Type of token
 *         chat_token:
 *           type: string
 *           description: Token for chat functionality
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: User's ID
 *             fullName:
 *               type: string
 *               description: User's full name
 *             email:
 *               type: string
 *               description: User's email
 *             role:
 *               type: string
 *               enum: [client, lawyer, admin]
 *               description: User's role
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
 */

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
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: User registered successfully
   *                 data:
   *                   $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Validation error
   *       500:
   *         description: Server error
   */
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          return res.status(400).json({
            status: "error",
            message: "Validation error",
            data: errorData,
          });
        } catch {
          return res.status(500).json({
            status: "error",
            message: "Error during register",
          });
        }
      }
      return res.status(500).json({
        status: "error",
        message: "Error during register",
      });
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
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Login successful
   *                 data:
   *                   $ref: '#/components/schemas/LoginResponse'
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Invalid email/password
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Validation error
   *       500:
   *         description: Server error
   */
  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Invalid email/password") {
          return res.status(401).json({
            status: "error",
            message: error.message,
          });
        }
        try {
          const errorData = JSON.parse(error.message);
          return res.status(400).json({
            status: "error",
            message: "Validation error",
            data: errorData,
          });
        } catch {
          return res.status(500).json({
            status: "error",
            message: "Error during login",
          });
        }
      }
      return res.status(500).json({
        status: "error",
        message: "Error during login",
      });
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
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: User profile retrieved successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                       description: User's ID
   *                     fullName:
   *                       type: string
   *                       description: User's full name
   *                     email:
   *                       type: string
   *                       description: User's email
   *                     phone:
   *                       type: string
   *                       description: User's phone number
   *                     dateOfBirth:
   *                       type: string
   *                       format: date
   *                       description: User's date of birth
   *                     city:
   *                       type: string
   *                       description: User's city
   *                     gender:
   *                       type: string
   *                       enum: [male, female]
   *                       description: User's gender
   *                     role:
   *                       type: string
   *                       enum: [client, lawyer, admin]
   *                       description: User's role
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
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const result = await AuthService.getMe(userId);
      res.status(200).json({
        status: "success",
        message: "User profile retrieved successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "User not found") {
        return res.status(404).json({
          status: "error",
          message: error.message,
        });
      }
      return res.status(500).json({
        status: "error",
        message: "Error getting user profile",
      });
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
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: User profile updated successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                       description: User's ID
   *                     fullName:
   *                       type: string
   *                       description: User's full name
   *                     email:
   *                       type: string
   *                       description: User's email
   *                     phone:
   *                       type: string
   *                       description: User's phone number
   *                     dateOfBirth:
   *                       type: string
   *                       format: date
   *                       description: User's date of birth
   *                     city:
   *                       type: string
   *                       description: User's city
   *                     gender:
   *                       type: string
   *                       enum: [male, female]
   *                       description: User's gender
   *                     role:
   *                       type: string
   *                       enum: [client, lawyer, admin]
   *                       description: User's role
   *       400:
   *         description: Invalid input data or update failed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 message:
   *                   type: string
   *                   example: Validation error
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
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const result = await AuthService.updateMe(userId, req.body);
      res.status(200).json({
        status: "success",
        message: "User profile updated successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not found") {
          return res.status(404).json({
            status: "error",
            message: error.message,
          });
        }
        if (error.message === "Failed to update user") {
          return res.status(400).json({
            status: "error",
            message: error.message,
          });
        }
        try {
          const errorData = JSON.parse(error.message);
          return res.status(400).json({
            status: "error",
            message: "Validation error",
            data: errorData,
          });
        } catch {
          return res.status(500).json({
            status: "error",
            message: "Error updating user profile",
          });
        }
      }
      return res.status(500).json({
        status: "error",
        message: "Error updating user profile",
      });
    }
  }
}
