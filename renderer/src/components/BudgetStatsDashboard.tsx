import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Card, CardContent } from "../components/ui/card";
import { Budget, Transaction } from "../types/types";

// Register required chart elements
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

export default function BudgetStatsDashboard({ budget }: { budget: Budget }) {
  const { currentAmount, maxAmount, transactions } = budget;

  const totalSpent = currentAmount;
  const remaining = maxAmount - currentAmount!;

  const transactionsByCategory = transactions.reduce(
    (acc: Record<string, number>, tx: Transaction) => {
      acc[tx.category.name] = (acc[tx.category.name] || 0) + tx.amount;
      return acc;
    },
    {}
  );

  const pieData = {
    labels: Object.keys(transactionsByCategory),
    datasets: [
      {
        data: Object.values(transactionsByCategory),
        backgroundColor: [
          "#a78bfa",
          "#fcd34d",
          "#f87171",
          "#34d399",
          "#60a5fa",
        ],
        borderWidth: 1,
      },
    ],
  };

  const transactionsByDate = transactions.reduce(
    (acc: Record<string, number>, tx: Transaction) => {
      const date = new Date(tx.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + tx.amount;
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(transactionsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const lineData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Daily Spending",
        data: sortedDates.map(date => transactionsByDate[date]),
        borderColor: "#a78bfa",
        backgroundColor: "rgba(167, 139, 250, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const topTransactions = [...transactions]
    .sort((a: Transaction, b: Transaction) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* KPI Card */}
      <Card className="flex flex-col justify-center h-full">
        <CardContent className="p-6 flex flex-col justify-center items-start space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Budget Usage</h2>
          <div className="text-5xl font-extrabold text-pastel-purple-300">
            ${totalSpent}
            <span className="text-3xl text-gray-400"> / ${maxAmount}</span>
          </div>
          <div className="text-lg text-gray-500">
            Remaining:{" "}
            <span
              className={`${remaining < 0 ? "text-red-500" : "text-green-500"}`}
            >
              ${remaining}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart Card */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Spending by Category</h2>
          <Pie data={pieData} />
        </CardContent>
      </Card>

      {/* Line Chart Card */}
      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Spending Over Time</h2>
          <Line data={lineData} />
        </CardContent>
      </Card>

      {/* Top Transactions Card */}
      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Top 3 Transactions</h2>
          <ul className="space-y-3">
            {topTransactions.map((tx: Transaction) => (
              <li
                key={tx.id}
                className="grid grid-cols-3 gap-4 items-center border-b pb-2 last:border-none"
              >
                <span className="text-base text-gray-800">{tx.name}</span>
                <span className="text-base font-medium text-red-500 justify-self-center">
                  ${tx.amount}
                </span>
                <span className="text-sm text-gray-500 justify-self-end">
                  {new Date(tx.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
