import express from "express";

import TransactionController from "../controllers/transaction.controller";

const router = express.Router();

router.post("/", TransactionController.createTransaction);

export default router;
