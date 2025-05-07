import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandGroup, CommandItem } from "./ui/command";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import { Trash2, PencilIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { Budget, Transaction } from "../types/types";
import { useTransactionStore } from "../stores/useTransactionStore";
import { useBudgetStore } from "../stores/useBudgetStore";

export default function TransactionList({ budget }: { budget: Budget }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchBudgets, setSelectedBudget } = useBudgetStore();

  const { transactions, categories, fetchCategories, fetchTransactions } =
    useTransactionStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    date: "",
    categoryId: "",
  });

  useEffect(() => {
    if (budget?.id) {
      fetchCategories();
      fetchTransactions(String(budget.id));
    }
  }, [budget?.id]);

  const resolveIcon = (iconName: string): IconType | undefined => {
    return (
      FaIcons[iconName as keyof typeof FaIcons] ||
      SiIcons[iconName as keyof typeof SiIcons]
    );
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const url = editingTransaction
      ? `http://localhost:3001/api/transactions/${editingTransaction.id}`
      : "http://localhost:3001/api/transactions";

    const method = editingTransaction ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        budgetId: id,
      }),
    });

    await fetchBudgets();
    await fetchTransactions(String(budget.id));
    const freshBudgets = useBudgetStore.getState().budgets;
    setSelectedBudget(freshBudgets.find(b => b.id === budget.id)!);
    setDialogOpen(false);
    setEditingTransaction(null);
    setForm({ name: "", amount: "", date: "", categoryId: "" });
  };

  const handleEdit = (tx: Transaction) => {
    console.log(tx);
    setEditingTransaction(tx);
    setForm({
      name: tx.name,
      amount: tx.amount.toString(),
      date: tx.date.slice(0, 10),
      categoryId: String(tx.category.id) || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (txId: number) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3001/api/transactions/${txId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await fetchBudgets();
    await fetchTransactions(String(budget.id));
    const freshBudgets = useBudgetStore.getState().budgets;
    setSelectedBudget(freshBudgets.find(b => b.id === budget.id)!);
  };

  return (
    <div className="min-h-screen p-6 bg-pastel-yellow-100 dark:bg-pastel-purple-500 text-gray-900 dark:text-white">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-4 text-pastel-purple-300 hover:text-pastel-purple-500"
      >
        ← Go Back
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pastel-purple-300">
          Transactions
        </h1>
        <Dialog
          open={dialogOpen}
          onOpenChange={open => {
            setDialogOpen(open);
            if (!open) {
              setEditingTransaction(null);
              setForm({ name: "", amount: "", date: "", categoryId: "" });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-pastel-purple-300 hover:bg-pastel-purple-500">
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-pastel-purple-300">
                {editingTransaction ? "Edit Transaction" : "New Transaction"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label className="text-pastel-purple-300">Name</Label>
                <Input
                  value={form.name}
                  className="focus:ring-pastel-purple-300"
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-pastel-purple-300">Amount</Label>
                <Input
                  type="number"
                  className="focus:ring-pastel-purple-300"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-pastel-purple-300">Date</Label>
                <Input
                  type="date"
                  className="focus:ring-pastel-purple-300"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-pastel-purple-300">Category</Label>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between dark:bg-pastel-purple-700"
                    >
                      {(() => {
                        const selected = categories.find(
                          cat => cat.id.toString() === form.categoryId
                        );
                        if (!selected) return "Select a category";
                        const Icon = resolveIcon(selected.icon);
                        return (
                          <span className="flex items-center gap-2">
                            {Icon && <Icon className="w-5 h-5" />}
                            {selected.name}
                          </span>
                        );
                      })()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 dark:bg-pastel-purple-700">
                    <Command>
                      <CommandGroup>
                        {categories.map(category => {
                          const Icon = resolveIcon(category.icon);
                          return (
                            <CommandItem
                              key={category.id}
                              onSelect={() => {
                                setForm({
                                  ...form,
                                  categoryId: category.id.toString(),
                                });
                                setPopoverOpen(false);
                              }}
                              className="cursor-pointer flex items-center gap-2"
                            >
                              {Icon && <Icon className="w-5 h-5" />}
                              {category.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                className="bg-pastel-purple-300 hover:bg-pastel-purple-500"
                onClick={handleSubmit}
              >
                {editingTransaction ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {transactions.map(tx => {
          const Icon = resolveIcon(tx.category?.icon);
          return (
            <div
              key={tx.id}
              className="relative bg-white text-pastel-purple-300 dark:text-pastel-yellow-300 dark:bg-pastel-purple-300 rounded-xl p-6 shadow-md hover:scale-[1.02] transition-transform"
            >
              <div>
                <p className="text-lg font-semibold">{tx.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {tx.date}
                </p>
                {tx.category && (
                  <p className="text-sm italic text-gray-500 flex gap-2">
                    Category: {tx.category.name}
                    {Icon && <Icon className="w-5 h-5" />}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">${tx.amount.toFixed(2)}</p>
                <div className="flex gap-2 justify-end mt-2">
                  <PencilIcon
                    className="absolute top-4 right-10 text-gray-500 hover:text-pastel-purple-300  z-10 cursor-pointer"
                    onClick={() => handleEdit(tx)}
                  />
                  <Trash2
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10 cursor-pointer"
                    onClick={() => handleDelete(tx.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
