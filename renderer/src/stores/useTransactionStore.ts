// src/store/transactionStore.ts
import { create } from "zustand";
import { Transaction, Category } from "../types/types";

interface TransactionState {
  transactions: Transaction[];
  categories: Category[];
  fetchTransactions: (budgetId: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  categories: [],
  fetchTransactions: async (budgetId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3001/api/transactions/budget/${budgetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    set({ transactions: data });
  },
  fetchCategories: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3001/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    set({ categories: data });
  },
}));
