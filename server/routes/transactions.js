import express from "express";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "../controllers/transactionsController.js";
import Transaction from "../models/Transaction.js";
import CategoryBudget from "../models/CategoryBudget.js";


const router = express.Router();

router.get("/monthly-expenses", async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalExpense: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formatted = result.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      expense: item.totalExpense,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch monthly expenses" });
  }
});

router.get("/category-expenses", async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: "$category",
          totalExpense: { $sum: "$amount" },
        },
      },
      { $sort: { totalExpense: -1 } },
    ]);

    const formatted = result.map((item) => ({
      name: item._id,
      expense: item.totalExpense,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category expenses" });
  }
});

router.get("/total-expenses", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const totalExpense = transactions.reduce((acc, tx) => acc + tx.amount, 0);
    res.json({ totalExpense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch total expenses" });
  }
});

router.get("/category-breakdown", async (req, res) => {
  try {
    const breakdown = await Transaction.aggregate([
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
    ]);
    const formatted = breakdown.map((item) => ({
      category: item._id,
      amount: item.amount,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category breakdown" });
  }
});

// Most Recent Transaction Route
router.get("/recent", async (req, res) => {
  try {
    const recent = await Transaction.findOne().sort({ date: -1 });
    res.json(recent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recent transaction" });
  }
});


router.post("/budgets", async (req, res) => {
  const { category, budgetAmount, month, year } = req.body;
  try {
    const existingBudget = await CategoryBudget.findOne({ category, month, year });
    if (existingBudget) {
      return res.status(400).json({
        message: "Budget for this category and month already exists.",
      });
    }

    const newBudget = new CategoryBudget({ category, budgetAmount, month, year });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    console.error("Error saving budget:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/budgets", async (req, res) => {
  try {
    const budgets = await CategoryBudget.find();
    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

router.get("/", getTransactions);
router.post("/", addTransaction);
router.delete("/:id", deleteTransaction);
router.put("/:id", updateTransaction);

export default router;
