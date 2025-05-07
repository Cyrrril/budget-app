import { Request, Response } from "express";
import { Category } from "../models/category.entity";
import { AppDataSource } from "../models/data-source";

export const getCategories = async (req: Request, res: Response) => {
  const categoryRepo = AppDataSource.getRepository(Category);
  const categories = await categoryRepo.find();
  res.json(categories);
};
