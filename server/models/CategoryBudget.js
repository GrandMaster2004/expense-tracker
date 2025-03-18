import mongoose from "mongoose";

const categoryBudgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  budgetAmount: { type: Number, required: true },
  month: { type: Number, required: true }, 
  year: { type: Number, required: true },
});

const CategoryBudget = mongoose.model("CategoryBudget", categoryBudgetSchema);

export default CategoryBudget;
