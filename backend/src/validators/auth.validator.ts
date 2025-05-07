import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = registerSchema;

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return;
  }
  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return;
  }
  next();
};
