import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { deleteTransaction } from "../services/api";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  IconButton,
} from "@mui/material";
import TransactionForm from "./TransactionForm";
import CloseIcon from "@mui/icons-material/Close";

export default function TransactionList({ transactions, refreshData }) {
  const [expanded, setExpanded] = useState({});
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [open, setOpen] = useState(false);

  if (!Array.isArray(transactions)) return <p>No transactions available.</p>;

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    refreshData();
  };

  const toggleDescription = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEdit = (txn) => {
    setSelectedTransaction(txn);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div>
      {transactions.map((txn) => {
        const words = txn.description.trim().split(/\s+/);
        const showFull = expanded[txn._id];
        const displayText = showFull
          ? txn.description
          : words.slice(0, 50).join(" ") + (words.length > 50 ? "..." : "");

        return (
          <Card
            key={txn._id}
            sx={{
              maxWidth: 800,
              margin: "16px auto",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {new Date(txn.date).toLocaleDateString()}
                </Typography>
                <Typography variant="h6" color="green">
                  ₹{txn.amount}
                </Typography>
              </Stack>

              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {displayText}{" "}
                {words.length > 100 && (
                  <Button
                    size="small"
                    onClick={() => toggleDescription(txn._id)}
                  >
                    {showFull ? "Show Less" : "Show More"}
                  </Button>
                )}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
              <Chip label={txn.category} color="primary" />
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => handleEdit(txn)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(txn._id)}
                >
                  Delete
                </Button>
              </Stack>
            </CardActions>
          </Card>
        );
      })}

      {/* Edit Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { backgroundColor: "white", color: "black" }, 
          },
        }}
        // sx={{ color: "black" }}
        // style={{ color: "black" }}
      >
        <DialogTitle sx={{ color: "black" }}>
          Edit Transaction
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: "black" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ p: 3 }}>
          <TransactionForm
            selectedTransaction={selectedTransaction}
            refreshData={() => {
              refreshData();
              handleClose();
            }}
            clearSelected={handleClose}
            sx={{ color: "black" }}
          />
        </Box>
      </Dialog>
    </div>
  );
}
