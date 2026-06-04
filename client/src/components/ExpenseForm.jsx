import { useState, useEffect } from "react";
import { addExpense, updateExpense } from "../api/expenseApi";
export default function ExpenseForm({ onSuccess, editingExpense, setEditingExpense }) {
  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    date: "",
    note: "",
    paymentMethod: "UPI",
    tags: "",
    recurring: false,
  });
  useEffect(() => {
  if (editingExpense) {
    setForm({
      amount: editingExpense.amount || "",
      category: editingExpense.category || "Food",
      date: editingExpense.date || "",
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
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("EDIT MODE:", editingExpense);
  console.log("FORM DATA:", form);

  try {
    const cleanData = {
      ...form,
      recurring: form.recurring ? 1 : 0,
    };

    if (editingExpense) {
      console.log("UPDATING ID:", editingExpense.id);

      await updateExpense(editingExpense.id, cleanData);
      setEditingExpense(null);
    } else {
      await addExpense(cleanData);
    }

    setForm({
      amount: "",
      category: "Food",
      date: "",
      note: "",
      paymentMethod: "UPI",
      tags: "",
      recurring: false,
    });

    if (onSuccess) onSuccess();
  } catch (err) {
    console.log("ERROR FULL:", err.response?.data || err.message);
    alert("Failed to save expense");
  }
};

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        Add Expense
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

        {/* Date */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Add Expense
        </button>

      </form>
    </div>
  );
}