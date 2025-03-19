import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const SummaryCards = () => {
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [recentTransaction, setRecentTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const [totalRes, categoryRes, recentRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/transactions/total-expenses`
          ),
          axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/transactions/category-breakdown`
          ),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/transactions/recent`),
        ]);

        // console.log("Total Expenses:", totalRes.data);
        // console.log("Category Breakdown:", categoryRes.data);
        // console.log("Recent Transaction:", recentRes.data);

        setTotalExpenses(totalRes.data.totalExpense);

        const categories = Array.isArray(categoryRes.data)
          ? categoryRes.data
          : [];
        setCategoryBreakdown(categories);

        setRecentTransaction(recentRes.data);
      } catch (error) {
        console.error("Error fetching summary data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Expenses</Typography>
            <Typography variant="h4">₹{totalExpenses}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Category Breakdown</Typography>
            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map((category, index) => (
                <Typography key={index}>
                  {category.category}: ₹{category.amount}
                </Typography>
              ))
            ) : (
              <Typography>No data</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Most Recent Transaction</Typography>
            {recentTransaction ? (
              <>
                <Typography>₹{recentTransaction.amount}</Typography>
                <Typography>
                  {new Date(recentTransaction.date).toLocaleDateString()}
                </Typography>
              </>
            ) : (
              <Typography>No recent transactions.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
