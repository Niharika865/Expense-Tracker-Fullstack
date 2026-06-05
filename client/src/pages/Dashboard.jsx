import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { getExpenses, getSummary } from "../api/expenseApi";

export default function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);

  const [budgets] = useState(() => {
  const savedBudgets = localStorage.getItem("budgets");

  const defaultBudgets = {
    Food: 5000,
    Transport: 3000,
    Bills: 7000,
    Entertainment: 0,
    Shopping: 0,
    Healthcare: 0,
    Education: 5000,
    Travel: 0,
    Rent: 0,
    Utilities: 0,
    Groceries: 0,
    Subscriptions: 0,
    Insurance: 0,
    Gifts: 0,
    Other: 0,
  };

  return savedBudgets
    ? {
        ...defaultBudgets,
        ...JSON.parse(savedBudgets),
      }
    : defaultBudgets;
});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const exp = await getExpenses();
      const sum = await getSummary();

      setExpenses(exp.data.data);
      setSummary(sum.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF4444",
    "#A569BD",
    "#5DADE2",
    "#58D68D",
    "#F4D03F",
    "#EB984E",
    "#EC7063",
    "#7DCEA0",
  ];
  const dashboardCategories = [
  "Food",
  "Transport",
  "Bills",
  "Education",
];

  const pieData = summary?.categoryBreakdown
    ? Object.entries(summary.categoryBreakdown).map(
        ([key, value]) => ({
          name: key,
          value,
        })
      )
    : [];

  const spentByCategory = {};

  expenses.forEach((expense) => {
    spentByCategory[expense.category] =
      (spentByCategory[expense.category] || 0) +
      Number(expense.amount);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow mb-6">

        <h1 className="text-3xl font-bold text-blue-700">
          Expense Tracker
        </h1>

        <div className="flex gap-3">

          <button
            onClick={() => navigate("/add")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Add Expense
          </button>

          <button
            onClick={() => navigate("/history")}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
          >
            History
          </button>

          <button
            onClick={() => navigate("/budget")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Budget
          </button>

        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-5 mb-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Spent</p>

          <h2 className="text-2xl font-bold text-blue-700">
            
            {formatCurrency( summary?.totalSpentThisMonth || 0 )}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Average Expense</p>

          <h2 className="text-2xl font-bold text-green-600">
            
            {formatCurrency( summary?.averageExpense || 0 )}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Highest Expense</p>

          <h2 className="text-2xl font-bold text-red-500">
            {formatCurrency( summary?.highestExpense || 0 )}
          </h2>
        </div>

      </div>

      {/* PIE CHART + BUDGET */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* PIE CHART */}
        <div className="bg-white p-5 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            Expense Breakdown
          </h2>

          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
            >
              {pieData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>

        </div>

        {/* BUDGET OVERVIEW */}
        <div className="bg-white p-5 rounded-xl shadow">

          <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold">
    Budget Overview
  </h2>

  <button
    onClick={() => navigate("/budget-overview")}
    className="text-blue-600 hover:underline"
  >
    View Full →
  </button>
</div>

          {dashboardCategories.map((category) => {
  const spent =
    spentByCategory[category] || 0;

  const budget =
    budgets[category] || 0;

  const percent =
    budget > 0
      ? (spent / budget) * 100
      : spent > 0
      ? 100
      : 0;

  return (
    <div
      key={category}
      className="mb-5"
    >
      <div className="flex justify-between mb-2">
        <span className="font-medium">
          {category}
        </span>

        <span>
          {formatCurrency(spent)} /
          {formatCurrency(budget)}
        </span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full">
        <div
          className={`h-3 rounded-full ${
            percent > 100 || (budget === 0 && spent > 0)
              ? "bg-red-500"
              : spent > 0
              ? "bg-green-500"
              : "bg-gray-400"
          }`}
          style={{
            width: `${Math.min(percent, 100)}%`,
          }}
        />
      </div>

      {spent === 0 && (
        <p className="text-gray-500 text-sm mt-1">
          No expenses yet
        </p>
      )}

      {(percent > 100 ||
        (budget === 0 && spent > 0)) && (
        <p className="text-red-500 text-sm mt-1">
          ⚠ Budget Exceeded
        </p>
      )}
    </div>
  );
})}

        </div>

      </div>

      {/* RECENT EXPENSES */}
      <div className="bg-white p-5 rounded-xl shadow">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-semibold">
            Recent Expenses
          </h2>

          <button
            onClick={() => navigate("/history")}
            className="text-blue-600 font-medium hover:underline"
          >
            View All →
          </button>

        </div>

        {expenses.length === 0 ? (
          <p className="text-gray-500">
            No expenses found.
          </p>
        ) : (
          [...expenses]
  .sort(
    (a, b) =>
      new Date(b.date) - new Date(a.date)
  )
  .slice(0, 5)
  .map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between border-b py-3"
            >
              <span>{expense.category}</span>

              <span className="font-semibold">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))
        )}

      </div>

    </div>
  );
}