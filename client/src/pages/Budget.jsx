import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Budget() {
  const navigate = useNavigate();

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

  const [budgets, setBudgets] = useState(() => {
    const savedBudgets =
      localStorage.getItem("budgets");

    return savedBudgets
      ? {
          ...defaultBudgets,
          ...JSON.parse(savedBudgets),
        }
      : defaultBudgets;
  });

  useEffect(() => {
    localStorage.setItem(
      "budgets",
      JSON.stringify(budgets)
    );
  }, [budgets]);

  const handleChange = (
    category,
    value
  ) => {
    setBudgets({
      ...budgets,
      [category]: Number(value),
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Budget Settings
        </h1>

        {Object.keys(budgets).map(
          (category) => (
            <div
              key={category}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-40 font-medium">
                {category}
              </div>

              <input
                type="number"
                min="0"
                value={budgets[category]}
                onChange={(e) =>
                  handleChange(
                    category,
                    e.target.value
                  )
                }
                className="border rounded p-2 w-48"
              />

              <span>₹</span>
            </div>
          )
        )}

        <div className="flex gap-4 mt-6">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Back
          </button>

        </div>

      </div>

    </div>
  );
}