import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  Box,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";

const MonthlyExpensesChart = ({ text }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/transactions/monthly-expenses`
        );
        console.log("Fetched Data:", res.data);

        if (Array.isArray(res.data)) {
          setData(res.data);
          setError("");
        } else {
          setData([]);
          setError("Invalid data format received.");
        }
      } catch (err) {
        console.error("Failed to fetch monthly expenses", err);
        setError("Failed to fetch data. Please try again later.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <Card
      sx={{
        width: "95%",
        margin: "1rem auto",
        padding: "1rem",
        boxShadow: 3,
        borderRadius: "12px",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {text || "Monthly Expenses"}
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
          <Typography textAlign="center">No expense data available.</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expense" fill="#1976d2" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyExpensesChart;
