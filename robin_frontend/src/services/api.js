import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL; 


const TransactionAPI = axios.create({
  baseURL: `${BASE_URL}/transactions`, 
});

// Transaction APIs
export const getTransactions = async () => {
  try {
    const res = await TransactionAPI.get("/");
    return res.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const addTransaction = async (data) => {
  try {
    const res = await TransactionAPI.post("/", data);
    return res.data;
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
};

export const deleteTransaction = async (id) => {
  try {
    const res = await TransactionAPI.delete(`/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting transaction:", error);
  }
};

export const updateTransaction = async (id, transaction) => {
  try {
    const res = await TransactionAPI.put(`/${id}`, transaction);
    return res.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
  }
};

// Budget API 
const BudgetAPI = axios.create({
  baseURL: `${BASE_URL}/category-budget`, 
});

export const getBudgets = async () => {
  try {
    const res = await BudgetAPI.get("/");
    return res.data;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }
};

export const addBudget = async (budgetData) => {
  try {
    const response = await BudgetAPI.post("/", budgetData);
    return response.data;
  } catch (error) {
    console.error("Error adding budget:", error);
    throw error;
  }
};

export const deleteBudget = async (id) => {
  try {
    const res = await BudgetAPI.delete(`/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw error;
  }
};

export const updateBudget = async (id, updatedData) => {
  try {
    const res = await BudgetAPI.put(`/${id}`, updatedData);
    return res.data;
  } catch (error) {
    console.error("Error updating budget:", error);
    throw error;
  }
};
