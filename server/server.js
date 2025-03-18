import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import transactionsRoutes from "./routes/transactions.js";
import categoryBudgetRoutes from "./routes/categoryBudgetRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/transactions", transactionsRoutes);
// app.use("/api/category-budget", categoryBudgetRoutes);
app.use("/api/category-budget", categoryBudgetRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
