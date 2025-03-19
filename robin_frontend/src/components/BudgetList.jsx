import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { getBudgets, deleteBudget, updateBudget } from "../services/api";

const BudgetList = () => {
  const [budgets, setBudgets] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
      toast.success("Budget deleted!");
      alert("Budget deleted!");
      fetchBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const handleEditClick = (budget) => {
    setEditData(budget);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await updateBudget(editData._id, editData);
      setEditData(null);
      toast.success("Budget updated!");
      fetchBudgets();
    } catch (error) {
      toast.error("Error updating budget");
      // console.error("Error updating budget:", error);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Your Budget List
      </Typography>

      <Grid container spacing={3}>
        {budgets.length > 0 ? (
          budgets.map((budget) => (
            <Grid item xs={12} sm={6} md={4} key={budget._id}>
              <Card
                sx={{
                  minHeight: "180px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "15px",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{budget.category}</Typography>
                  <Typography>Budget: ₹{budget.budgetAmount}</Typography>
                  <Typography>Month: {budget.month}</Typography>
                  <Typography>Year: {budget.year}</Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditClick(budget)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(budget._id)}
                    sx={{ mt: 1 }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No Budgets Found!</Typography>
        )}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={!!editData} onClose={() => setEditData(null)}>
        <DialogTitle>Edit Budget</DialogTitle>
        {editData && (
          <>
            <DialogContent>
              <TextField
                label="Category"
                name="category"
                value={editData.category}
                onChange={handleEditChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Budget Amount"
                name="budgetAmount"
                type="number"
                value={editData.budgetAmount}
                onChange={handleEditChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Month"
                name="month"
                type="number"
                value={editData.month}
                onChange={handleEditChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Year"
                name="year"
                type="number"
                value={editData.year}
                onChange={handleEditChange}
                fullWidth
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditData(null)}>Cancel</Button>
              <Button
                onClick={handleEditSave}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default BudgetList;
