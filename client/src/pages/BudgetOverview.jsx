import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExpenses } from "../api/expenseApi";

export default function BudgetOverview() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);

  const budgets = (() => {
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
  })();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getExpenses();
      setExpenses(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const spentByCategory = {};

  expenses.forEach((expense) => {
    spentByCategory[expense.category] =
      (spentByCategory[expense.category] || 0) +
      Number(expense.amount);
  });

  return (
    <div className="min-h-screen bg-blue-50 p-6">

      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold text-blue-700">
            Full Budget Overview
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back
          </button>

        </div>

        {Object.keys(budgets).map((category) => {
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
              className="mb-6"
            >
              <div className="flex justify-between mb-2">

                <span className="font-semibold">
                  {category}
                </span>

                <span>
                  ₹{spent.toLocaleString("en-IN")} /
                  ₹{budget.toLocaleString("en-IN")}
                </span>

              </div>

              <div className="w-full bg-gray-200 h-4 rounded-full">

                <div
                  className={`h-4 rounded-full ${
                    percent > 100 ||
                    (budget === 0 && spent > 0)
                      ? "bg-red-500"
                      : spent > 0
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                  style={{
                    width: `${Math.min(
                      percent,
                      100
                    )}%`,
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
  );
}