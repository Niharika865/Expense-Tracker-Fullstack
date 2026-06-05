import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";

export default function AddExpense() {
  const navigate = useNavigate();
  const [editingExpense, setEditingExpense] = useState(null);

  const handleSuccess = () => {
    // after adding expense → go back to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">
          Add Expense
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Back
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto">

        <ExpenseForm
          onSuccess={handleSuccess}
          editingExpense={editingExpense}
          setEditingExpense={setEditingExpense}
        />

      </div>

    </div>
  );
}