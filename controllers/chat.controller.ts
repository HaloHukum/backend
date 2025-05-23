import { Request, Response } from "express";

import ChatService from "../services/chat.service";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateChannelRequest:
 *       type: object
 *       required:
 *         - clientId
 *         - lawyerId
 *       properties:
 *         clientId:
 *           type: string
 *           description: ID of the client user
 *         lawyerId:
 *           type: string
 *           description: ID of the lawyer user
 *     ChannelResponse:
 *       type: object
 *       properties:
 *         channelId:
 *           type: string
 *           description: Unique identifier for the chat channel
 *         name:
 *           type: string
 *           description: Name of the chat channel
 *         members:
 *           type: array
 *           description: List of channel members with their roles
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Member user ID
 *               role:
 *                 type: string
 *                 description: Role of the member (client or lawyer)
 */

export default class ChatController {
  /**
   * @swagger
   * /chats:
   *   post:
   *     summary: Create a new chat channel between client and lawyer
   *     tags: [Chats]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateChannelRequest'
   *     responses:
   *       201:
   *         description: Chat channel created successfully
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
   *                   example: Chat channel created successfully
   *                 data:
   *                   $ref: '#/components/schemas/ChannelResponse'
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
   *                   example: clientId and lawyerId are required
   *       401:
   *         description: Unauthorized - User not authenticated
   *       500:
   *         description: Server error
   */
  static async createChannel(req: Request, res: Response) {
    try {
      const { clientId, lawyerId } = req.body;

      const result = await ChatService.createChannel(clientId, lawyerId);

      res.status(201).json({
        status: "success",
        message: "Chat channel created successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      });
    }
  }
}
