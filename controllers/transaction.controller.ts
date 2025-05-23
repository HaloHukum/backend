import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../interfaces/auth.interface";
import { TransactionService } from "../services/transaction.service";

export default class TransactionController {
  static async createTransaction(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      //   if (!req.user) {
      //     return res.status(401).json({
      //       status: "error",
      //       message: "Unauthorized - User not authenticated",
      //     });
      //   }
      const response = await TransactionService.createTransaction(req.body);

      res.status(201).json({
        status: "success",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
