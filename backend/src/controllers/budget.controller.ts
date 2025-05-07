// controllers/budget.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../models/data-source";
import { Budget } from "../models/budget.entity";
import { User } from "../models/user.entity";

export const getBudgets = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const budgetRepo = AppDataSource.getRepository(Budget);

  const budgets = await budgetRepo.find({ where: { user: { id: userId } } });
  res.json(budgets);
};

export const getBudgetById = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const budgetId = parseInt(req.params.id);

  const budgetRepo = AppDataSource.getRepository(Budget);
  const budget = await budgetRepo.findOne({
    where: { id: budgetId, user: { id: userId } },
  });

  if (!budget) {
    res.status(404).json({ message: "Budget not found" });
    return;
  }

  res.status(200).json({ budget: budget });
}

export const createBudget = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { title, maxAmount, startDate, endDate, isRepeatable, repeatType } = req.body;

  const userRepo = AppDataSource.getRepository(User);
  const budgetRepo = AppDataSource.getRepository(Budget);

  const user = await userRepo.findOneBy({ id: userId });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const budget = budgetRepo.create({ title, maxAmount, startDate, endDate, isRepeatable, repeatType, user });
  await budgetRepo.save(budget);

  res.status(201).json(budget);
};

export const deleteBudget = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const budgetId = parseInt(req.params.id);

  const budgetRepo = AppDataSource.getRepository(Budget);
  const budget = await budgetRepo.findOne({
    where: { id: budgetId, user: { id: userId } },
  });

  if (!budget) {
    res.status(404).json({ message: "Budget not found" });
    return;
  }

  await budgetRepo.remove(budget);
  res.json({ message: "Budget deleted" });
};
