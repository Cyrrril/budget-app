import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionsByBudget,
  deleteTransaction,
  updateTransaction
} from "../controllers/transaction.controller";
import { authGuard } from "../middlewares/auth.guard";

const router = express.Router();

router.get("/", authGuard, getAllTransactions);
router.post("/", authGuard, createTransaction);
router.get("/budget/:id", authGuard, getTransactionsByBudget);
router.delete("/:id", authGuard, deleteTransaction);
router.patch("/:id", authGuard, updateTransaction);

export default router;
