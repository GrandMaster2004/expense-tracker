import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTransaction, updateTransaction } from "../services/api";
import * as z from "zod";
import { useEffect } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import { TextField, MenuItem } from "@mui/material";

const schema = z.object({
  amount: z.preprocess(
    (val) => Number(val) || 0,
    z.number().min(1, "Amount is required")
  ),
  description: z
    .string()
    .min(1, "Description is required")
    .refine((val) => val.trim().split(/\s+/).length <= 1000, {
      message: "Description must be 1000 words or less",
    }),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
});

export default function TransactionForm({
  selectedTransaction,
  refreshData,
  clearSelected,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0, description: "some", date: "", category: "" },
  });

  useEffect(() => {
    if (selectedTransaction) {
      reset({
        amount: selectedTransaction.amount,
        description: selectedTransaction.description,
        date: new Date(selectedTransaction.date).toISOString().split("T")[0],
        category: selectedTransaction.category,
      });
    } else {
      reset({ amount: 0, description: "something", date: "", category: "" });
    }
  }, [selectedTransaction, reset]);

  const onSubmit = async (data) => {
    if (selectedTransaction) {
      await updateTransaction(selectedTransaction._id, data);
      clearSelected();
    } else {
      await addTransaction(data);
    }
    refreshData();
    reset();
  };

  const whiteStyles = {
    input: { color: "black" },
  };

  const labelStyle = { color: "gray" };

  const borderStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "gray" },
      "&:hover fieldset": { borderColor: "gray" },
      "&.Mui-focused fieldset": { borderColor: "gray" },
    },
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <TextField
        required
        label="Amount"
        {...register("amount", { valueAsNumber: true })}
        placeholder="Amount"
        type="number"
        InputProps={{ style: whiteStyles.input }}
        InputLabelProps={{ style: labelStyle }}
        sx={borderStyle}
        error={!!errors.amount}
        helperText={errors.amount?.message}
      />

      <TextField
        required
        label="Date"
        type="date"
        {...register("date")}
        InputProps={{ style: whiteStyles.input }}
        InputLabelProps={{ shrink: true, style: labelStyle }}
        sx={borderStyle}
        error={!!errors.date}
        helperText={errors.date?.message}
      />
      <TextField
        required
        label="Description"
        {...register("description")}
        placeholder="Description"
        type="text"
        InputProps={{ style: whiteStyles.input }}
        InputLabelProps={{ style: labelStyle }}
        sx={borderStyle}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <TextField
        required
        label="Category"
        select
        {...register("category")}
        InputProps={{ style: whiteStyles.input }}
        InputLabelProps={{ style: labelStyle }}
        sx={borderStyle}
        error={!!errors.category}
        helperText={errors.category?.message}
      >
        <MenuItem value="">Select Category</MenuItem>
        <MenuItem value="Food">Food</MenuItem>
        <MenuItem value="Travel">Travel</MenuItem>
        <MenuItem value="Bills">Bills</MenuItem>
        <MenuItem value="Shopping">Shopping</MenuItem>
      </TextField>
      <button
        type="submit"
        style={{
          color: "grey",
          background: "transparent",
          border: "1px solid white",
          padding: "15px 20px",
          borderRadius: "5px",
          marginTop: "10px",
        }}
      >
        {selectedTransaction ? "Update" : "Add"}
      </button>
    </Box>
  );
}
