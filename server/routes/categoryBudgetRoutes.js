import express from "express";
import CategoryBudget from "../models/CategoryBudget.js";

const router = express.Router();

// POST route to add a budget
router.post("/", async (req, res) => {
  const { category, budgetAmount, month, year } = req.body;

  try {
    const existingBudget = await CategoryBudget.findOne({
      category,
      month,
      year,
    });
    if (existingBudget) {
      return res.status(400).json({
        message: "Budget for this category and month already exists.",
      });
    }

    const newBudget = new CategoryBudget({
      category,
      budgetAmount,
      month,
      year,
    });

    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    console.error("Error saving budget:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET route to fetch budgets
router.get("/", async (req, res) => {
  const { month, year } = req.query;
  try {
    const query = month && year ? { month, year } : {};
    const budgets = await CategoryBudget.find(query);
    res.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updatedBudget = await CategoryBudget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.json(updatedBudget);
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE Budget
router.delete("/:id", async (req, res) => {
  try {
    const deletedBudget = await CategoryBudget.findByIdAndDelete(req.params.id);
    if (!deletedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
