import express from "express";
import authRoutes from "./routes/auth.routes";
import budgetRoutes from "./routes/budget.routes";
import transactionRoutes from "./routes/transaction.routes";
import categoryRoutes from "./routes/category.routes";
import { AppDataSource } from "./models/data-source";
import { seedCategories } from "./seeds/category.seed";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
const port = 3001;

AppDataSource.initialize().then(async () => {
  console.log("Database initialized");
  await seedCategories();
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use("/api/auth", authRoutes);
  app.use("/api/budgets", budgetRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/categories", categoryRoutes);
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
