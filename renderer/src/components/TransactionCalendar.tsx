import { useState, useEffect } from "react";
import {
  parseISO,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
} from "date-fns";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import { IconType } from "react-icons";

type Transaction = {
  id: number;
  name: string;
  amount: number;
  date: string;
  category: {
    name: string;
    icon: string;
  };
};

const resolveIcon = (iconName: string): IconType | undefined => {
  return (
    FaIcons[iconName as keyof typeof FaIcons] ||
    SiIcons[iconName as keyof typeof SiIcons]
  );
};

export default function TransactionCalendar() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3001/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getTransactionsForDay = (day: Date) =>
    transactions.filter(t => isSameDay(parseISO(t.date), day));

  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const currentDay = day; // clone reference for current iteration
        const dayTransactions = getTransactionsForDay(currentDay);
        const Icon =
          dayTransactions.length > 0
            ? resolveIcon(dayTransactions[0].category.icon)
            : null;

        days.push(
          <div
            key={currentDay.toISOString()}
            className={`border p-3 h-24 rounded-xl flex flex-col justify-between cursor-pointer ${
                isSameDay(day, new Date())
                  ? "bg-pastel-purple-100"
                  : ""
              } ${
              currentDay.getMonth() !== currentMonth.getMonth()
                ? "opacity-30"
                : ""
            }`}
            onClick={() => {
              console.log(currentDay);
              setSelectedDate(new Date(currentDay.getTime()));
            }}
          >
            <div
              className={`text-sm font-medium ${
                isSameDay(currentDay, selectedDate || new Date())
                  ? "text-pastel-purple-500"
                  : "text-gray-800"
              } `}
            >
              {currentDay.getDate()}
            </div>
            <div className="flex items-center justify-between mt-1">
              {Icon && <Icon className="text-lg text-purple-300" />}
              {dayTransactions.length > 1 && (
                <div className="text-xs bg-pastel-purple-100 text-gray-800 px-1.5 py-0.5 rounded-full">
                  +{dayTransactions.length - 1}
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-2">
          {days}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="p-6 rounded-2xl bg-white shadow-xl max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <button
          className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
          onClick={() =>
            setCurrentMonth(
              prev => new Date(prev.getFullYear(), prev.getMonth() - 1)
            )
          }
        >
          Prev
        </button>
        <h2 className="text-xl font-bold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
          onClick={() =>
            setCurrentMonth(
              prev => new Date(prev.getFullYear(), prev.getMonth() + 1)
            )
          }
        >
          Next
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center text-sm text-muted-foreground mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">{renderCalendarGrid()}</div>

      {/* Transaction List for Selected Date */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">
            Transactions on {selectedDate.toDateString()}
          </h3>
          <ul className="space-y-2">
            {getTransactionsForDay(selectedDate).length === 0 ? (
              <p className="text-gray-500 italic">No transactions.</p>
            ) : (
              getTransactionsForDay(selectedDate).map(tx => {
                const Icon = resolveIcon(tx.category.icon);
                return (
                  <li
                    key={tx.id}
                    className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      {Icon ? (
                        <Icon className="text-primary" />
                      ) : (
                        <FaIcons.FaQuestion className="text-gray-400" />
                      )}
                      <span className="font-medium">{tx.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({tx.category.name})
                      </span>
                    </div>
                    <span className="text-pastel-purple-500 font-semibold">
                      ${tx.amount}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
