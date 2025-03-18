import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now, required: true },
  description: { type: String, required: true },
  category: { type: String, default: "Uncategorized" },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;


