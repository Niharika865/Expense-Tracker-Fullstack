import { Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import Budget from "./pages/Budget";
import BudgetOverview from "./pages/BudgetOverview";
export default function App() {
  return (
    <Routes>
  <Route path="/" element={<Welcome />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/history" element={<History />} />
  <Route path="/add" element={<AddExpense />} />
  <Route path="/edit/:id" element={<EditExpense />} />
  <Route path="/budget" element={<Budget />} />
  <Route
    path="/budget-overview"
    element={<BudgetOverview />}
  />
</Routes>
  );
}