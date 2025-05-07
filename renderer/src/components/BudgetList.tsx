import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useBudgetStore } from "../stores/useBudgetStore";

export default function BudgetList() {
  const { budgets, setSelectedBudget, fetchBudgets } = useBudgetStore();
  const navigate = useNavigate();

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3001/api/budgets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await fetchBudgets();
  };

  return (
    <div className="min-h-screen bg-pastel-yellow-100 dark:bg-pastel-purple-900 text-gray-900 dark:text-white transition-colors p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-pastel-purple-300 dark:text-pastel-yellow-300">
          Your Budgets
        </h1>
        <Button
          className="bg-pastel-purple-300 text-white hover:bg-pastel-purple-500"
          onClick={() => navigate("/budgets/new")}
        >
          + New Budget
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map(budget => (
          <div
            key={budget.id}
            className="relative bg-white text-pastel-purple-300 dark:text-pastel-yellow-300 dark:bg-pastel-purple-300 rounded-xl p-6 shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => {
                setSelectedBudget(budget);
                navigate(`/budgets/${budget.id}`);
            }}
          >
            <h2 className="text-2xl font-semibold">{budget.title}</h2>
            <p className="mt-1">
              <span className="font-medium">Current:</span> $
              {budget.currentAmount?.toFixed(2) || "0.00"}
            </p>
            <p>
              <span className="font-medium">Max:</span> $
              {budget.maxAmount.toFixed(2)}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Period:</span>{" "}
              {formatDate(budget.startDate)} – {formatDate(budget.endDate)}
            </p>
            <p className="text-sm">
              <span className="font-medium">Repeat:</span>{" "}
              {budget.isRepeatable && budget.repeatType
                ? budget.repeatType?.charAt(0).toUpperCase() +
                  budget.repeatType?.slice(1)
                : "No"}
            </p>

            <Trash2
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10"
              onClick={e => {
                e.stopPropagation();
                handleDelete(budget.id);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
