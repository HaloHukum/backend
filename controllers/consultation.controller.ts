import { Request, Response } from "express";

import { IUser } from "../interfaces/user.interface";
import ConsultationService from "../services/consultation.service";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Consultation:
 *       type: object
 *       required:
 *         - userId
 *         - lawyerId
 *         - categoryId
 *         - caseType
 *         - problemDescription
 *         - legalBasis
 *         - analysis
 *         - conclusionAndAdvice
 *         - chatId
 *         - disclaimer
 *         - expiredAt
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the consultation
 *         userId:
 *           type: string
 *           description: Reference to the user who created the consultation
 *         lawyerId:
 *           type: string
 *           description: Reference to the lawyer assigned to the consultation
 *         categoryId:
 *           type: string
 *           description: The category of the legal consultation
 *         caseType:
 *           type: string
 *           description: Type of legal case
 *         problemDescription:
 *           type: string
 *           description: Detailed description of the legal problem
 *         legalBasis:
 *           type: string
 *           description: Legal basis for the consultation
 *         analysis:
 *           type: string
 *           description: Legal analysis of the case
 *         conclusionAndAdvice:
 *           type: string
 *           description: Final conclusion and legal advice
 *         chatId:
 *           type: string
 *           description: Reference to the associated chat
 *         disclaimer:
 *           type: string
 *           description: Legal disclaimer
 *         expiredAt:
 *           type: string
 *           format: date-time
 *           description: Expiration date of the consultation
 *         status:
 *           type: string
 *           enum: [active, expired]
 *           description: Current status of the consultation
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date
 *     ConsultationResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Consultation created successfully
 *         data:
 *           $ref: '#/components/schemas/Consultation'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Consultation not found
 */

export default class ConsultationController {
  /**
   * @swagger
   * /consultations:
   *   post:
   *     summary: Create a new consultation
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - lawyerId
   *               - categoryId
   *               - caseType
   *               - problemDescription
   *               - legalBasis
   *               - analysis
   *               - conclusionAndAdvice
   *               - chatId
   *               - disclaimer
   *               - durationMinutes
   *               - expiredAt
   *             properties:
   *               lawyerId:
   *                 type: string
   *                 example: "60d21b4667d0d8992e610c85"
   *               categoryId:
   *                 type: string
   *                 example: "criminal_law"
   *               caseType:
   *                 type: string
   *                 example: "Criminal Case"
   *               problemDescription:
   *                 type: string
   *                 example: "Need legal advice regarding a criminal case"
   *               method:
   *                 type: string
   *                 enum: [chat, call, video]
   *                 example: "chat"
   *               legalBasis:
   *                 type: string
   *                 example: "Based on Criminal Code Article 123"
   *               analysis:
   *                 type: string
   *                 example: "Initial analysis of the case"
   *               conclusionAndAdvice:
   *                 type: string
   *                 example: "Legal advice and conclusion"
   *               chatId:
   *                 type: string
   *                 example: "chat_123"
   *               disclaimer:
   *                 type: string
   *                 example: "Legal disclaimer text"
   *               durationMinutes:
   *                 type: number
   *                 minimum: 0
   *                 example: 60
   *               expiredAt:
   *                 type: string
   *                 format: date-time
   *                 example: "2024-12-31T23:59:59Z"
   *     responses:
   *       201:
   *         description: Consultation created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ConsultationResponse'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   */
  static async createConsultation(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }
      const durationMinutes = req.body.durationMinutes || 60;
      const expiredAt = await ConsultationService.getExpiredAt(durationMinutes); // output:

      const consultation = await ConsultationService.createConsultation({
        ...req.body,
        userId: req.user._id,
        status: "active",
        durationMinutes,
        expiredAt,
      });
      res.status(201).json({
        status: "success",
        message: "Consultation created successfully",
        data: consultation,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /consultations:
   *   get:
   *     summary: Get all consultations with optional filters
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: userId
   *         schema:
   *           type: string
   *         description: Filter by user ID
   *       - in: query
   *         name: lawyerId
   *         schema:
   *           type: string
   *         description: Filter by lawyer ID
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [active, expired]
   *         description: Filter by status
   *     responses:
   *       200:
   *         description: List of consultations
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
   *                   example: Consultations retrieved successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Consultation'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  static async getConsultations(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const consultations = await ConsultationService.getConsultations(
        req.query
      );
      res.status(200).json({
        status: "success",
        message: "Consultations retrieved successfully",
        data: consultations,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /consultations/{id}:
   *   get:
   *     summary: Get a consultation by ID
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Consultation ID
   *     responses:
   *       200:
   *         description: Consultation found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ConsultationResponse'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Consultation not found
   */
  static async getConsultation(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const consultation = await ConsultationService.getConsultationById(
        req.params.id
      );
      if (!consultation) {
        return res.status(404).json({
          status: "error",
          message: "Consultation not found",
        });
      }

      // Check if user has access to this consultation
      const isOwner = await ConsultationService.isConsultationOwner(
        req.params.id,
        req.user._id.toString(),
        req.user.role === "lawyer"
      );

      if (!isOwner) {
        return res.status(403).json({
          status: "error",
          message: "You don't have access to this consultation",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Consultation retrieved successfully",
        data: consultation,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /consultations/channels/{id}:
   *   get:
   *     summary: Get consultation details by chat ID
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Chat ID to find the consultation
   *     responses:
   *       200:
   *         description: Consultation found
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
   *                   example: Consultation retrieved successfully
   *                 data:
   *                   type: object
   *                   properties:
   *                     chatId:
   *                       type: string
   *                       example: "chat_123"
   *                     expiredAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-12-31T23:59:59Z"
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Consultation not found
   */
  static async getConsultationByChatId(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      const consultation = await ConsultationService.getConsultationByChatId(
        req.params.id
      );

      if (!consultation) {
        return res.status(404).json({
          status: "error",
          message: "Consultation not found",
        });
      }

      // Check if user has access to this consultation
      const isOwner = await ConsultationService.isConsultationOwner(
        req.params.id,
        req.user._id.toString(),
        req.user.role === "lawyer"
      );

      if (!isOwner) {
        return res.status(403).json({
          status: "error",
          message: "You don't have access to this consultation",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Consultation retrieved successfully",
        data: {
          chatId: consultation.chatId,
          expiredAt: consultation.expiredAt,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /consultations/{id}:
   *   put:
   *     summary: Update a consultation
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Consultation ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [active, expired]
   *                 example: expired
   *               analysis:
   *                 type: string
   *                 example: "Updated analysis"
   *               conclusionAndAdvice:
   *                 type: string
   *                 example: "Updated conclusion"
   *     responses:
   *       200:
   *         description: Consultation updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ConsultationResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Consultation not found
   */
  static async updateConsultation(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      // Check if user has access to this consultation
      const isOwner = await ConsultationService.isConsultationOwner(
        req.params.id,
        req.user._id.toString(),
        req.user.role === "lawyer"
      );

      if (!isOwner) {
        return res.status(403).json({
          status: "error",
          message: "You don't have access to this consultation",
        });
      }

      const consultation = await ConsultationService.updateConsultation(
        req.params.id,
        req.body
      );

      if (!consultation) {
        return res.status(404).json({
          status: "error",
          message: "Consultation not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Consultation updated successfully",
        data: consultation,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  /**
   * @swagger
   * /consultations/{id}:
   *   delete:
   *     summary: Delete a consultation
   *     tags: [Consultations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Consultation ID
   *     responses:
   *       200:
   *         description: Consultation deleted successfully
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
   *                   example: Consultation deleted successfully
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Consultation not found
   */
  static async deleteConsultation(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized - User not authenticated",
        });
      }

      // Check if user has access to this consultation
      const isOwner = await ConsultationService.isConsultationOwner(
        req.params.id,
        req.user._id.toString(),
        req.user.role === "lawyer"
      );

      if (!isOwner) {
        return res.status(403).json({
          status: "error",
          message: "You don't have access to this consultation",
        });
      }

      const consultation = await ConsultationService.deleteConsultation(
        req.params.id
      );
      if (!consultation) {
        return res.status(404).json({
          status: "error",
          message: "Consultation not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Consultation deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
}
