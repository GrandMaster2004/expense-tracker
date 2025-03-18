import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";
import MonthlyExpensesChart from "./MonthlyExpensesChart";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA336A",
  "#33AA99",
  "#8884d8",
];

const DataInsights = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [totalYearly, setTotalYearly] = useState(0);
  const [topCategory, setTopCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/transactions`
        );
        const data = res.data;
        setTransactions(data);

        // Monthly Trend Data
        const monthly = {};
        const category = {};
        let yearlyTotal = 0;

        data.forEach((t) => {
          const key = `${t.month}-${t.year}`;
          monthly[key] = (monthly[key] || 0) + t.amount;
          category[t.category] = (category[t.category] || 0) + t.amount;
          yearlyTotal += t.amount;
        });

        // Format for Line Chart
        const monthlyArray = Object.keys(monthly).map((key) => ({
          month: key,
          total: monthly[key],
        }));

        // Format for Pie Chart
        const categoryArray = Object.keys(category).map((key) => ({
          name: key,
          value: category[key],
        }));

        // Find Top Category
        const topCat = Object.keys(category).reduce((a, b) =>
          category[a] > category[b] ? a : b
        );

        setMonthlyData(monthlyArray);
        setCategoryData(categoryArray);
        setTotalYearly(yearlyTotal);
        setTopCategory(topCat);
      } catch (err) {
        console.error("Error fetching data insights:", err);
      }
    };

    fetchData();
  }, []);
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom></Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        {/* <Card height={350}> */}
        {/* <CardContent> */}
        <MonthlyExpensesChart text="Monthly Spending Trend" />
        {/* </CardContent> */}
        {/* </Card> */}
      </Grid>

      <Grid item xs={12} md={6} topmargin={"135px"} margin={"15px 0 0 0"}>
        <Card>
          <CardContent>
            <Typography variant="h6">Top Spending Categories</Typography>
            <ResponsiveContainer width="100%" height={435}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Yearly Summary</Typography>
            <Typography>Total Spending This Year: ₹{totalYearly}</Typography>
            <Typography>Top Category: {topCategory}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DataInsights;
