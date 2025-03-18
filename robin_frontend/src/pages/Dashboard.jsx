import React from "react";
import { Container, Typography } from "@mui/material";
import SummaryCards from "../components/SummaryCards";
import DataInsights from "../components/DataInsights";

const Dashboard = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Spending Insights
      </Typography>
      <SummaryCards />
      <DataInsights />
    </Container>
  );
};

export default Dashboard;
