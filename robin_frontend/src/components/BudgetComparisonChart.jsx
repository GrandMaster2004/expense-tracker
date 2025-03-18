import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";

const BudgetComparisonChart = () => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const budgetsRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/category-budget`
        );

        const transactionsRes = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/transactions?month=${month}&year=${year}`
        );

        const mergedData = budgetsRes.data.map((budget) => {
          const actual = transactionsRes.data
            .filter((t) => t.category === budget.category)
            .reduce((sum, t) => sum + Number(t.amount), 0);

          return {
            category: budget.category,
            Budgeted: Number(budget.budgetAmount),
            Actual: actual,
          };
        });

        setData(mergedData);
        setError("");
      } catch (err) {
        console.error("Error fetching comparison data:", err);
        setError("Failed to fetch budget comparison data.");
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [month, year]);

  return (
    <Card
      sx={{
        width: "95%",
        margin: "1.5rem auto",
        padding: "1rem",
        boxShadow: 3,
        borderRadius: "12px",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Budget vs Actual Comparison
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        ) : data.length === 0 ? (
          <Typography textAlign="center">
            No budget comparison data available.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Budgeted" fill="#8884d8" />
              <Bar dataKey="Actual" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetComparisonChart;
