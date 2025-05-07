// stores/useBudgetStore.ts
import { create } from "zustand";
import { Budget, Transaction } from "../types/types"; // adjust paths as needed

type BudgetStore = {
  budgets: Budget[];
  selectedBudget: Budget | null;
  setBudgets: (budgets: Budget[]) => void;
  setSelectedBudget: (budget: Budget | null) => void;
  fetchBudgets: () => Promise<void>;
};

export const useBudgetStore = create<BudgetStore>(set => ({
  budgets: [],
  selectedBudget: null,
  setBudgets: budgets => set({ budgets }),
  setSelectedBudget: budget => set({ selectedBudget: budget }),
  fetchBudgets:  async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3001/api/budgets", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: Budget[] = await res.json();

    const budgetsWithAmounts = await Promise.all(
      data.map(async budget => {
        const txRes = await fetch(
          `http://localhost:3001/api/transactions/budget/${budget.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const transactions = await txRes.json();
        const currentAmount = transactions.reduce(
          (sum: number, tx: Transaction) => sum + tx.amount,
          0
        );
        return { ...budget, currentAmount, transactions };
      })
    );
    set({ budgets: budgetsWithAmounts });
  },
}));
