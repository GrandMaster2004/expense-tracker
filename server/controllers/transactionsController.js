import Transaction from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
