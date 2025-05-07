import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../models/data-source';
import { User } from '../models/user.entity';

const SECRET = 'your_secret_key'; // Replace with env later

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  const existing = await userRepository.findOneBy({ email });
  
  if (existing) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User();
  newUser.email = email;
  newUser.password = hashed;
  
  await userRepository.save(newUser);

  res.status(201).json({ message: 'User registered' });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ email });
  
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });

  res.json({ token });
};
