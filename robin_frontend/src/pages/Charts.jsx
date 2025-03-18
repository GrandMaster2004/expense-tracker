// pages/Charts.jsx
import React from "react";
import { Container, Typography } from "@mui/material";
import MonthlyExpensesChart from "../components/MonthlyExpensesChart";

const Charts = () => {
  return (
    <Container width="200%" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Monthly Expenses Chart
      </Typography>

      <MonthlyExpensesChart />
    </Container>
  );
};

export default Charts;
