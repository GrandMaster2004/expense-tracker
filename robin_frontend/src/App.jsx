import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import { getTransactions, getBudgets } from "./services/api";
import "./App.css";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import CategoryExpensesPieChart from "./components/CategoryExpensesPieChart";
import BudgetForm from "./components/BudgetForm";
import BudgetList from "./components/BudgetList";
import BudgetComparisonChart from "./components/BudgetComparisonChart";
import { Typography } from "@mui/material";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch all transactions
  const fetchTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  // Fetch all budgets
  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  // Handle editing transaction
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Clear selected transaction
  const clearSelected = () => {
    setSelectedTransaction(null);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <>
      <ResponsiveAppBar />

      <Routes>
        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <div className="container1">
              <Dashboard />
            </div>
          }
        />

        {/* Charts Route */}
        <Route
          path="/charts"
          element={
            <div className="container1">
              <Charts />
            </div>
          }
        />

        {/* Category Pie Chart */}
        <Route
          path="/categories"
          element={
            <div className="container1">
              <CategoryExpensesPieChart />
            </div>
          }
        />

        {/* Budget Form Route */}
        <Route
          path="/setbudget"
          element={
            <div className="container2">
              <BudgetForm onBudgetAdded={fetchBudgets} />
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <BudgetList />
              </div>
              <div>
                <Typography variant="h5" gutterBottom>
                  Budget vs Actual Comparison Chart
                </Typography>
                <BudgetComparisonChart />
              </div>
            </div>
          }
        />

       
        <Route
          path="/"
          element={
            <div className="container1">
              <h1>Transaction Manager</h1>

              
              <TransactionForm
                selectedTransaction={selectedTransaction}
                refreshData={fetchTransactions}
                clearSelected={clearSelected}
              />
              <TransactionList
                transactions={transactions}
                refreshData={fetchTransactions}
                handleEdit={handleEdit}
              />
            </div>
          }
        />
      </Routes>
    </>
  );
}
