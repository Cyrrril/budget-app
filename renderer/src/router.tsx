import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NewBudget from "./pages/NewBudget";
import BudgetDetails from "./pages/BudgetDetails";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/home", element: <Home /> },
  { path: "/budgets/new", element: <NewBudget /> },
  { path: "/budgets/:id", element: <BudgetDetails /> },
]);
