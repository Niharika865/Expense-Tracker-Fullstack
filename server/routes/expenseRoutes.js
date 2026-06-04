const express = require("express");
const router = express.Router();


const {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getSummary,
} = require("../controllers/expenseController");
router.get("/summary", getSummary);
router.get("/", getAllExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);


module.exports = router;