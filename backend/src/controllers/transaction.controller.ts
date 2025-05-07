import { Request, Response } from "express";
import { AppDataSource } from "../models/data-source";
import { Transaction } from "../models/transaction.entity";
import { Budget } from "../models/budget.entity";
import { Category } from "../models/category.entity";

export const getAllTransactions = async (req: Request, res: Response) => {
  const transactions = await AppDataSource.getRepository(Transaction).find({
    relations: ["category", "budget"],
  });
  res.json(transactions);
};

export const createTransaction = async (req: Request, res: Response) => {
  const { name, amount, date, categoryId, budgetId } = req.body;

  const transactionRepo = AppDataSource.getRepository(Transaction);
  const budgetRepo = AppDataSource.getRepository(Budget);
  const categoryRepo = AppDataSource.getRepository(Category);

  try {
    const budget = await budgetRepo.findOneByOrFail({ id: budgetId });
    const category = await categoryRepo.findOneByOrFail({ id: categoryId });

    const transaction = transactionRepo.create({
      name,
      amount,
      date: date,
      budget,
      category,
    });

    await transactionRepo.save(transaction);
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create transaction" });
  }
};

export const getTransactionsByBudget = async (req: Request, res: Response) => {
  const { id } = req.params;
  const transactionRepo = AppDataSource.getRepository(Transaction);
  const transactions = await transactionRepo.find({
    where: { budget: { id: Number(id) } },
    relations: ["category"],
    order: { date: "DESC" },
  });
  res.json(transactions);
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const repo = AppDataSource.getRepository(Transaction);
    const transaction = await repo.findOneBy({ id });

    if (!transaction)
      res.status(404).json({ message: "Transaction not found" });

    await repo.remove(transaction!);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, amount, date, categoryId } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const repo = AppDataSource.getRepository(Transaction);
    const transaction = await repo.findOneBy({ id });

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
    } else {
      transaction.name = name ?? transaction.name;
      transaction.amount = amount ?? transaction.amount;
      transaction.date = date ?? transaction.date;
      transaction.category = categoryId
        ? ({ id: categoryId } as any)
        : transaction.category;

      const updatedTx = await repo.save(transaction);
      res.json(updatedTx);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
