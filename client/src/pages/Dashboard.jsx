import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import ExpenseForm from "../components/ExpenseForm";
import { getExpenses, getSummary, deleteExpense } from "../api/expenseApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [graphView, setGraphView] = useState("month");
  const [sortOrder, setSortOrder] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ budgets
  const [budgets, setBudgets] = useState({
    Food: 5000,
    Transport: 3000,
    Bills: 7000,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const exp = await getExpenses();
    const sum = await getSummary();

    setExpenses(exp.data.data);
    setSummary(sum.data.data);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  const exportToExcel = () => {
    const exportData = filteredExpenses.map((expense) => ({
      Category: expense.category,
      Amount: expense.amount,
      Date: expense.date,
      PaymentMethod: expense.paymentMethod,
      Note: expense.note,
      Tags: expense.tags,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      fileData,
      `expenses_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // pie data
  const pieData = summary?.categoryBreakdown
    ? Object.entries(summary.categoryBreakdown).map(([key, value]) => ({
        name: key,
        value,
      }))
    : [];

  // graph data
  const graphData = [];

  expenses.forEach((expense) => {
    const dateObj = new Date(expense.date);

    let label = "";

    if (graphView === "month") {
      label = dateObj.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
    } else if (graphView === "year") {
      label = dateObj.getFullYear().toString();
    } else {
      const day = dateObj.getDate();
      if (day <= 7) label = "Week 1";
      else if (day <= 14) label = "Week 2";
      else if (day <= 21) label = "Week 3";
      else label = "Week 4";
    }

    const existing = graphData.find((item) => item.label === label);

    if (existing) {
      existing.amount += Number(expense.amount);
    } else {
      graphData.push({
        label,
        amount: Number(expense.amount),
      });
    }
  });

  // ✅ FILTERED EXPENSES
  const filteredExpenses = expenses
    .filter((expense) => {
      const categoryMatch =
        selectedCategory === "All" ||
        expense.category === selectedCategory;

      const paymentMatch =
        selectedPayment === "All" ||
        expense.paymentMethod === selectedPayment;

      const searchMatch =
        expense.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.tags?.toLowerCase().includes(searchTerm.toLowerCase());

      const startMatch =
        !startDate || expense.date >= startDate;

      const endMatch =
        !endDate || expense.date <= endDate;

      return (
        categoryMatch &&
        paymentMatch &&
        searchMatch &&
        startMatch &&
        endMatch
      );
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date) - new Date(a.date);
      }
      return new Date(a.date) - new Date(b.date);
    });

  // ✅ BUDGET CALCULATION (FIXED POSITION)
  const spentByCategory = {};

  filteredExpenses.forEach((exp) => {
    spentByCategory[exp.category] =
      (spentByCategory[exp.category] || 0) + Number(exp.amount);
  });

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <div className="space-y-6">

      <ExpenseForm
        onSuccess={loadData}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
      />

      {/* SUMMARY */}
      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded shadow">
          <div>Total</div>
          <div className="text-xl font-bold">
            {Number(summary?.totalSpentThisMonth || 0).toLocaleString(navigator.language, {
              style: "currency",
              currency: "INR",
            })}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div>Average</div>
          <div className="text-xl font-bold">
            {Number(summary?.averageExpense || 0).toLocaleString(navigator.language, {
              style: "currency",
              currency: "INR",
            })}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div>Highest</div>
          <div className="text-xl font-bold text-red-500">
            {Number(summary?.highestExpense || 0).toLocaleString(navigator.language, {
              style: "currency",
              currency: "INR",
            })}
          </div>
        </div>

      </div>

      {/* PIE CHART */}
      <div className="bg-white p-4 rounded shadow">
        <h2>Expense Breakdown</h2>

        <PieChart width={400} height={300}>
          <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* BUDGET SECTION (CORRECT PLACE) */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-3">Category Budgets</h2>

        {Object.keys(budgets).map((cat) => (
          <div key={cat} className="flex items-center gap-3 mb-2">
            <span className="w-32">{cat}</span>

            <input
              type="number"
              value={budgets[cat]}
              onChange={(e) =>
                setBudgets({
                  ...budgets,
                  [cat]: Number(e.target.value),
                })
              }
              className="border p-1 rounded w-32"
            />

            <span>₹</span>
          </div>
        ))}
      </div>

      {/* BUDGET OVERVIEW */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Budget Overview</h2>

        {Object.keys(budgets).map((cat) => {
          const spent = spentByCategory[cat] || 0;
          const budget = budgets[cat];
          const percent = (spent / budget) * 100;

          return (
            <div key={cat} className="mb-4">

              <div className="flex justify-between">
                <span>{cat}</span>
                <span>₹{spent} / ₹{budget}</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className={`h-2 rounded ${
                    percent > 100 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>

              {percent > 100 && (
                <p className="text-red-500 text-sm">
                  ⚠ Budget exceeded!
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* EXPENSE LIST */}
      <div className="bg-white p-4 rounded shadow">

        <div className="grid grid-cols-5 gap-4 font-bold text-center">
          <span>Category</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Edit</span>
          <span>Delete</span>
        </div>

        {filteredExpenses.map((e) => (
          <div key={e.id} className="grid grid-cols-5 gap-4 text-center py-2">

            <span>{e.category}</span>

            <span>
              {Number(e.amount).toLocaleString(navigator.language, {
                style: "currency",
                currency: "INR",
              })}
            </span>

            <span>{new Date(e.date).toLocaleDateString()}</span>

            <button onClick={() => handleEdit(e)} className="text-blue-500">
              Edit
            </button>

            <button onClick={() => handleDelete(e.id)} className="text-red-500">
              Delete
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}