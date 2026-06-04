import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid,} from "recharts";
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
    loadData(); // refresh UI
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

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Expenses"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(
    fileData,
    `expenses_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};
const pieData = summary?.categoryBreakdown
  ? Object.entries(summary.categoryBreakdown).map(([key, value]) => ({
      name: key,
      value: value,
    }))
  : [];
  const graphData = [];

expenses.forEach((expense) => {
  const dateObj = new Date(expense.date);

  let label = "";

  if (graphView === "month") {
  label = dateObj.toLocaleString("default", {
    month: "short",
    year: "2-digit",
  });
}

  else if (graphView === "year") {
    label = dateObj.getFullYear().toString();
  }

  else if (graphView === "week") {
    const day = dateObj.getDate();

    if (day <= 7) label = "Week 1";
    else if (day <= 14) label = "Week 2";
    else if (day <= 21) label = "Week 3";
    else label = "Week 4";
  }

  const existing = graphData.find(
    (item) => item.label === label
  );

  if (existing) {
    existing.amount += Number(expense.amount);
  } else {
    graphData.push({
      label,
      amount: Number(expense.amount),
    });
  }
});
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#ff6b6b",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#83a6ed",
  "#ffbb28",
  "#00C49F",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#775DD0",
];
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
      !startDate ||
      expense.date >= startDate;

    const endMatch =
      !endDate ||
      expense.date <= endDate;

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
  return (
    <div className="space-y-6">
<ExpenseForm
  onSuccess={loadData}
  editingExpense={editingExpense}
  setEditingExpense={setEditingExpense}
/>   
{/* Summary Section */}
<div className="grid grid-cols-4 gap-4">
  
  <div className="bg-white p-4 rounded shadow">
    <div className="text-sm text-gray-500">Total</div>
    <div className="text-xl font-bold">
      {Number(summary?.totalSpentThisMonth || 0)
      .toLocaleString(navigator.language, {
  style: "currency",
  currency: "INR",
})}
    </div>
  </div>

  <div className="bg-white p-4 rounded shadow">
  <div className="text-sm text-gray-500">
    Average Expense
  </div>

  <div className="text-xl font-bold">
    {Number(summary?.averageExpense || 0).toLocaleString(navigator.language, {
  style: "currency",
  currency: "INR",
})}
  </div>
</div>

  
  <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
  <div className="text-sm text-gray-500">
    Highest Expense
  </div>

  <div className="text-xl font-bold text-red-500">
    {Number(summary?.highestExpense || 0).toLocaleString(navigator.language, {
  style: "currency",
  currency: "INR",
})}
  </div>
</div>

</div>
<div className="bg-white p-4 rounded shadow">
  <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>

  {pieData.length > 0 && (
    <PieChart width={400} height={300}>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  )}
</div>
<div className="bg-white p-4 rounded shadow">

  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">
      Expense Trends
    </h2>

    <select
      value={graphView}
      onChange={(e) => setGraphView(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="month">Month</option>
      <option value="year">Year</option>
      <option value="week">Week</option>
    </select>
  </div>

  <BarChart
    width={250}
    height={150}
    data={graphData}
  >
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="label" />

    <YAxis />

    <Tooltip />

    <Bar
      dataKey="amount"
      fill="#8884d8"
    />
  </BarChart>

</div>
<div className="bg-white p-4 rounded shadow">
  <input
    type="text"
    placeholder="Search category, note, or tags..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full border p-2 rounded"
  />
</div>
<div className="bg-white p-4 rounded shadow">

  <h3 className="font-semibold mb-3">
    Date Range Filter
  </h3>

  <div className="flex gap-3">

    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="border p-2 rounded"
    />

    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="border p-2 rounded"
    />

  </div>

</div>
<div className="bg-white p-4 rounded shadow">
  <label className="block mb-2 font-semibold">
    Filter by Category
  </label>

  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="w-full border p-2 rounded"
  >
    <option value="All">All</option>
    <option value="Food">Food</option>
    <option value="Transport">Transport</option>
    <option value="Bills">Bills</option>
    <option value="Entertainment">Entertainment</option>
    <option value="Shopping">Shopping</option>
    <option value="Healthcare">Healthcare</option>
    <option value="Education">Education</option>
    <option value="Travel">Travel</option>
    <option value="Rent">Rent</option>
    <option value="Utilities">Utilities</option>
    <option value="Groceries">Groceries</option>
    <option value="Subscriptions">Subscriptions</option>
    <option value="Insurance">Insurance</option>
    <option value="Gifts">Gifts</option>
    <option value="Other">Other</option>
  </select>
</div>
<div className="bg-white p-4 rounded shadow">
  <label className="block mb-2 font-semibold">
    Filter by Payment Method
  </label>

  <select
    value={selectedPayment}
    onChange={(e) => setSelectedPayment(e.target.value)}
    className="w-full border p-2 rounded"
  >
    <option value="All">All</option>
    <option value="UPI">UPI</option>
    <option value="Cash">Cash</option>
    <option value="Card">Card</option>
  </select>
</div>
<div className="bg-white p-4 rounded shadow">

  <label className="block mb-2 font-semibold">
    Sort By Date
  </label>

  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    className="border p-2 rounded"
  >
    <option value="newest">
      Newest First
    </option>

    <option value="oldest">
      Oldest First
    </option>

  </select>

</div>
      {/* Expense List */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-3">
  <h2 className="text-xl font-semibold">
    Expenses
  </h2>

  <button
    onClick={exportToExcel}
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Export Excel
  </button>
</div>
<div className="grid grid-cols-5 gap-4 font-bold border-b pb-2 mb-2 text-center">
  <span>Category</span>
  <span>Amount</span>
  <span>Date</span>
  <span>Edit</span>
  <span>Delete</span>
</div>
{filteredExpenses.map((e) => (
  <div
    key={e.id}
    className="grid grid-cols-5 gap-4 border-b py-2 items-center text-center"
  >
    {/* Category */}
    <span className="font-medium">{e.category}</span>

    {/* Amount */}
    <span>
      {Number(e.amount).toLocaleString(navigator.language, {
  style: "currency",
  currency: "INR",
})}
    </span>

    {/* Date (FIXED) */}
    <span>
      {new Date(e.date).toLocaleDateString("en-IN")}
    </span>

    {/* Edit */}
    <button
      onClick={() => handleEdit(e)}
      className="text-blue-500"
    >
      Edit
    </button>

    {/* Delete */}
    <button
      onClick={() => handleDelete(e.id)}
      className="text-red-500"
    >
      Delete
    </button>

  </div>
))}

      </div>
    </div>
  );
}