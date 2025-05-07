import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authGuard = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Missing token' });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'your_secret_key');
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
