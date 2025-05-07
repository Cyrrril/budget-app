// Home.tsx
import { useState } from "react";
import Tabs, { TabOption } from "../components/Tabs";
import BudgetList from "../components/BudgetList";
import TransactionCalendar from "../components/TransactionCalendar";


const tabOptions: TabOption[] = [
  { label: "Budgets", value: "budgets" },
  { label: "Calendar", value: "calendar" },
];

export default function Home() {
  const [tab, setTab] = useState("budgets");

  return (
    <div className="p-4">
      <Tabs options={tabOptions} onChange={setTab} />
      {tab === "budgets" ? <BudgetList /> : <TransactionCalendar />}
    </div>
  );
}
