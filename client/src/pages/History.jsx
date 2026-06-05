import { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "../api/expenseApi";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

export default function History() {
  const [expenses, setExpenses] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const navigate = useNavigate();

  const loadData = async () => {
    const res = await getExpenses();
    setExpenses(res.data.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    await deleteExpense(id);
    loadData();
  };

  const exportCSV = () => {
    const headers = [
      "Category",
      "Amount",
      "Date",
      "Note",
      "Payment Method",
      "Tags",
    ];

    const rows = filteredExpenses.map((expense) => [
      expense.category,
      expense.amount,
      expense.date,
      expense.note || "",
      expense.paymentMethod || "",
      expense.tags || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = `expenses_${
      new Date().toISOString().split("T")[0]
    }.csv`;

    link.click();
  };

  const applyThisMonth = () => {
    const today = new Date();

    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    setStartDate(
      firstDay.toISOString().split("T")[0]
    );

    setEndDate(
      today.toISOString().split("T")[0]
    );
  };

  const applyLastMonth = () => {
    const today = new Date();

    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    const lastDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    );

    setStartDate(
      firstDay.toISOString().split("T")[0]
    );

    setEndDate(
      lastDay.toISOString().split("T")[0]
    );
  };

  const categories = [
    "All",
    ...new Set(
      expenses.map((e) => e.category)
    ),
  ];

  const filteredExpenses = expenses
    .filter((expense) => {
      const categoryMatch =
        selectedCategory === "All" ||
        expense.category ===
          selectedCategory;

      const startMatch =
        !startDate ||
        new Date(expense.date) >=
          new Date(startDate);

      const endMatch =
        !endDate ||
        new Date(expense.date) <=
          new Date(endDate);

      return (
        categoryMatch &&
        startMatch &&
        endMatch
      );
    })
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

  return (
    <div className="min-h-screen bg-blue-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold text-blue-700">
          Expense History
        </h1>

        <div className="flex gap-3">

          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Export CSV
          </button>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>

        </div>

      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <h2 className="text-lg font-semibold mb-4">
          Filters
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>

            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }
              className="border p-2 rounded w-full"
            >
              {categories.map((cat) => (
                <option key={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              From Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              To Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              className="border p-2 rounded w-full"
            />
          </div>

        </div>

        <div className="flex gap-3 mt-4">

          <button
            onClick={applyThisMonth}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            This Month
          </button>

          <button
            onClick={applyLastMonth}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Last Month
          </button>

          <button
            onClick={() => {
              setSelectedCategory("All");
              setStartDate("");
              setEndDate("");
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Clear Filters
          </button>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">

        <div className="grid grid-cols-4 font-semibold border-b pb-3 text-gray-700">
          <span>Category</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        {filteredExpenses.map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-4 py-3 border-b items-center hover:bg-gray-50"
          >

            <span>{e.category}</span>

            <span>
              {formatCurrency(e.amount)}
            </span>

            <span>
              {new Date(
                e.date
              ).toLocaleDateString("en-IN")}
            </span>

            <div className="flex gap-4">

              <button
                onClick={() =>
                  navigate(
                    `/edit/${e.id}`
                  )
                }
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(e.id)
                }
                className="text-red-500 hover:underline"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

        {filteredExpenses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No expenses found
          </div>
        )}

      </div>

    </div>
  );
}