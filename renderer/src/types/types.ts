export type Tab = "budgets" | "calendar";

export interface Budget {
    id: number;
    title: string;
    maxAmount: number;
    startDate: string;
    endDate: string;
    isRepeatable: boolean;
    repeatType: "daily" | "weekly" | "monthly" | "yearly" | null;
    transactions: Transaction[];
    currentAmount?: number;
}

export interface Transaction {
    id: number;
    name: string;
    amount: number;
    category: Category;
    budget: Budget;
    date: string;
  }
  
export  interface Category {
    id: number;
    name: string;
    icon: string;
    iconUrl: string;
  }