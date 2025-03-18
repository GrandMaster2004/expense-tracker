import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#AA336A",
];

const CategoryExpensesPieChart = ({ onCategoryClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryExpenses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/transactions/category-expenses`
        );
        console.log("Fetched Category Expenses: ", res.data);

        if (Array.isArray(res.data)) {
          setData(res.data);
          setError("");
        } else {
          setData([]);
          setError("Invalid data format received.");
        }
      } catch (err) {
        console.error("Failed to fetch category expenses", err);
        setError("Failed to fetch data. Please try again later.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryExpenses();
  }, []);

  const handlePieClick = (data, index) => {
    if (onCategoryClick && data) {
      onCategoryClick(data.category);
    }
  };

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
          Category-wise Expenses
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
            No category data available.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="expense"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label
                onClick={(e, index) => handlePieClick(e.payload, index)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    cursor="pointer"
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" align="center" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryExpensesPieChart;
