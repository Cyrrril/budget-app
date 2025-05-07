import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function NewBudget() {
  const [title, setTitle] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isRepeatable, setIsRepeatable] = useState(false);
  const [repeatType, setRepeatType] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await fetch("http://localhost:3001/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        maxAmount: parseFloat(maxAmount),
        startDate,
        endDate,
        isRepeatable,
        repeatType: isRepeatable ? repeatType : null,
      }),
    });

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-pastel-yellow-100 dark:bg-pastel-purple-500 text-gray-900 dark:text-white p-6">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-4 text-pastel-purple-300 hover:text-pastel-purple-500"
      >
        ← Go Back
      </Button>
      <div className="max-w-md mx-auto bg-white dark:bg-pastel-purple-500 rounded-xl p-8 shadow">
        <h1 className="text-3xl font-bold mb-6 text-center text-pastel-purple-300 dark:text-pastel-yellow-300">
          Create New Budget
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="maxAmount">Max Amount</Label>
            <Input
              id="maxAmount"
              type="number"
              value={maxAmount}
              onChange={e => setMaxAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isRepeatable"
              checked={isRepeatable}
              onCheckedChange={val => setIsRepeatable(!!val)}
            />
            <Label htmlFor="isRepeatable">Is Repeatable?</Label>
          </div>

          {isRepeatable && (
            <div>
              <Label htmlFor="repeatType">Repeat Type</Label>
              <Select onValueChange={val => setRepeatType(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select repeat type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-pastel-purple-300 hover:bg-pastel-purple-500 text-white"
          >
            Save Budget
          </Button>
        </form>
      </div>
    </div>
  );
}
