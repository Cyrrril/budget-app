import { useState } from "react";
import Tabs, { TabOption } from "../components/Tabs";
import TransactionList from "../components/TransactionList";
import BudgetStatsDashboard from "../components/BudgetStatsDashboard";
import { useBudgetStore } from "../stores/useBudgetStore";


const tabOptions: TabOption[] = [
  { label: "Transactions", value: "transactions" },
  { label: "Statistics", value: "statistics" },
];

export default function BudgetDetails() {
  const [activeTab, setActiveTab] = useState("transactions");
  const { selectedBudget } = useBudgetStore();

  return (
    <div className="p-4">
      <Tabs options={tabOptions} onChange={setActiveTab} />

      {activeTab === "transactions" && (
        <TransactionList budget={selectedBudget!}/>
      )}

      {activeTab === "statistics" && (
        <BudgetStatsDashboard budget={selectedBudget!}/>
      )}
    </div>
  );
}
