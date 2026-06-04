const db = require("../database/db");

const createExpense = (req, res) => {
  try {
    const {
      amount,
      category,
      date,
      note,
      paymentMethod,
      tags,
      recurring,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const stmt = db.prepare(`
      INSERT INTO expenses (
        amount,
        category,
        date,
        note,
        paymentMethod,
        tags,
        recurring
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      amount,
      category,
      date,
      note || "",
      paymentMethod || "",
      tags || "",
      recurring ? 1 : 0
    );

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getAllExpenses = (req, res) => {
  try {
    const expenses = db.prepare(`
      SELECT *
      FROM expenses
      ORDER BY date DESC
    `).all();

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const updateExpense = (req, res) => {
  try {
    const { id } = req.params;

    const {
      amount,
      category,
      date,
      note,
      paymentMethod,
      tags,
      recurring,
    } = req.body;

    // Check if expense exists
    const existing = db.prepare(`
      SELECT * FROM expenses WHERE id = ?
    `).get(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Update record
    const stmt = db.prepare(`
      UPDATE expenses
      SET amount = ?,
          category = ?,
          date = ?,
          note = ?,
          paymentMethod = ?,
          tags = ?,
          recurring = ?,
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      amount || existing.amount,
      category || existing.category,
      date || existing.date,
      note || existing.note,
      paymentMethod || existing.paymentMethod,
      tags || existing.tags,
      recurring !== undefined ? (recurring ? 1 : 0) : existing.recurring,
      id
    );

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const deleteExpense = (req, res) => {
  try {
    const { id } = req.params;

    // Check if expense exists
    const existing = db.prepare(`
      SELECT * FROM expenses WHERE id = ?
    `).get(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Delete
    db.prepare(`
      DELETE FROM expenses WHERE id = ?
    `).run(id);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



const getSummary = (req, res) => {
  try {
    const expenses = db.prepare("SELECT * FROM expenses").all();

    let totalSpentThisMonth = 0;
    let totalExpenseCount = 0;
    let totalSpent = 0;
    let highestExpense = 0;

    const categoryBreakdown = {};
    const paymentMethodBreakdown = {};

    const currentMonth = new Date().toISOString().slice(0, 7);

    expenses.forEach((exp) => {
      const amount = Number(exp.amount); // 🔥 IMPORTANT FIX

      totalExpenseCount++;
      totalSpent += amount;

      if (amount > highestExpense) {
        highestExpense = amount;
      }

      // monthly filter
      if (exp.date.slice(0, 7) === currentMonth) {
        totalSpentThisMonth += amount;
      }

      // category breakdown
      categoryBreakdown[exp.category] =
        (categoryBreakdown[exp.category] || 0) + amount;

      // payment method breakdown
      if (exp.paymentMethod) {
        paymentMethodBreakdown[exp.paymentMethod] =
          (paymentMethodBreakdown[exp.paymentMethod] || 0) + amount;
      }
    });

    const averageExpense =
      totalExpenseCount > 0 ? totalSpent / totalExpenseCount : 0;

    res.json({
      success: true,
      data: {
        totalSpentThisMonth,
        totalExpenseCount,
        averageExpense,
        highestExpense,
        categoryBreakdown,
        paymentMethodBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getSummary,
};
