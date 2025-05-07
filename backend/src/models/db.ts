import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

export const initDB = async () => {
  return open({
    filename: path.resolve(process.cwd(), "budget.db"),
    driver: sqlite3.Database,
  });
};
