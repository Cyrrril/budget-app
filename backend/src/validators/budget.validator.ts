import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const createBudgetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number({ invalid_type_error: "Amount must be a number" }),
});

const updateBudgetSchema = z.object({
  name: z.string().min(1).optional(),
  amount: z.number().optional(),
});

export const validateCreateBudget = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = createBudgetSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return;
  }
  next();
};

export const validateUpdateBudget = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = updateBudgetSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return;
  }
  next();
};