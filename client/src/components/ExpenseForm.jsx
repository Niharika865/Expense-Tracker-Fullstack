import { useState, useEffect } from "react";
import { addExpense, updateExpense } from "../api/expenseApi";

export default function ExpenseForm({
  onSuccess,
  editingExpense,
  setEditingExpense,
}) {
  const todayStr = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    date: todayStr,
    note: "",
    paymentMethod: "UPI",
    tags: "",
    recurring: false,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setForm({
        amount: editingExpense.amount || "",
        category: editingExpense.category || "Food",
        date: editingExpense.date || todayStr,
        note: editingExpense.note || "",
        paymentMethod: editingExpense.paymentMethod || "UPI",
        tags: editingExpense.tags || "",
        recurring: editingExpense.recurring || false,
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ SAFE DATE CHECK (FIXED ISSUE)
    const today = new Date().toISOString().split("T")[0];

    if (form.date > today) {
      setError("Future dates are not allowed");
      return;
    }

    // basic validation
    if (!form.amount || form.amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    try {
      const cleanData = {
        ...form,
        recurring: form.recurring ? 1 : 0,
      };

      if (editingExpense) {
        await updateExpense(editingExpense.id, cleanData);
        setEditingExpense(null);
      } else {
        await addExpense(cleanData);
      }

      setForm({
        amount: "",
        category: "Food",
        date: todayStr,
        note: "",
        paymentMethod: "UPI",
        tags: "",
        recurring: false,
      });

      setError("");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.log(err);
      setError("Failed to save expense");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        {editingExpense ? "Update Expense" : "Add Expense"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Bills</option>
          <option>Entertainment</option>
          <option>Shopping</option>
          <option>Healthcare</option>
          <option>Education</option>
          <option>Travel</option>
          <option>Rent</option>
          <option>Utilities</option>
          <option>Groceries</option>
          <option>Subscriptions</option>
          <option>Insurance</option>
          <option>Gifts</option>
          <option>Other</option>
        </select>

        {/* Date (fixed + safe) */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          max={todayStr}
          className="w-full border p-2 rounded"
        />

        {/* Note */}
        <input
          type="text"
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Payment Method */}
        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>UPI</option>
          <option>Card</option>
          <option>Cash</option>
        </select>

        {/* Tags */}
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Recurring */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="recurring"
            checked={form.recurring}
            onChange={handleChange}
          />
          Recurring Expense
        </label>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {editingExpense ? "Update Expense" : "Add Expense"}
        </button>

      </form>
    </div>
  );
}