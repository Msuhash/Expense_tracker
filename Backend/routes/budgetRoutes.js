import express from "express";
import { createBudget, getBudget, deleteBudget, updateBudget, budgetSummary } from "../controllers/budgetController.js";
import tokenDecoder from "../middleware/authMiddleWare.js";

const Router = express.Router();

Router.post("/create-budget", tokenDecoder, createBudget);
Router.get("/get-budget", tokenDecoder, getBudget);
Router.delete("/delete-budget/:id", tokenDecoder, deleteBudget);
Router.put("/update-budget/:id", tokenDecoder, updateBudget);
Router.get("/summary-budget", tokenDecoder, budgetSummary);
// Router.put("/update-budget-amount/:id", tokenDecoder, updateBudgetAmount);

export default Router;