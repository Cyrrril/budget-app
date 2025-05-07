import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { Budget } from './budget.entity';
import { Transaction } from './transaction.entity';
import { Category } from './category.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './budget.db',
  synchronize: true, // Sync with DB, beware in production
  logging: false,
  entities: [User, Budget, Transaction, Category],
  migrations: [],
  subscribers: [],
});
