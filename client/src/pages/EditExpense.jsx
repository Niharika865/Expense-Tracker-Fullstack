import { useLocation, useNavigate } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";

export default function EditExpense() {
  const location = useLocation();
  const navigate = useNavigate();

  const expense = location.state?.expense;

  if (!expense) {
    return (
      <div className="p-10">
        <h2>No Expense Selected</h2>

        <button
          onClick={() => navigate("/history")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to History
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Edit Expense
        </h1>

        <ExpenseForm
          editingExpense={expense}
          setEditingExpense={() => {}}
          onSuccess={() => navigate("/history")}
        />

      </div>

    </div>
  );
}