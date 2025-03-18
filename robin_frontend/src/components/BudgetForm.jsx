import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { addBudget } from "../services/api";

const categories = [
  "Housing",
  "Food",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Other",
];

const BudgetForm = ({ onBudgetAdded }) => {
  const [formData, setFormData] = useState({
    category: "",
    budgetAmount: "",
    month: "",
    year: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBudget(formData);
      alert("Budget added successfully!");
      setFormData({ category: "", budgetAmount: "", month: "", year: "" });
      if (onBudgetAdded) onBudgetAdded();
    } catch (error) {
      console.error("Error adding budget:", error);
      alert(error.response?.data?.message || "Error adding budget");
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        backgroundColor: "#ffffff",
        padding: 3,
        borderRadius: 2,
        maxWidth: 600,
        margin: "2rem auto",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom align="center">
          Set Monthly Budget
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Budget Amount"
              name="budgetAmount"
              type="number"
              value={formData.budgetAmount}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Month (1-12)"
              name="month"
              type="number"
              value={formData.month}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ marginTop: 1 }}
            >
              Add Budget
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default BudgetForm;
