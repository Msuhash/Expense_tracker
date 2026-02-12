import express from "express";
import { addExpense, deleteExpense, getExpense, getExpenseById, updateExpense } from "../controllers/expenseController.js";
import tokenDecoder from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/add", tokenDecoder, addExpense);
router.get("/get", tokenDecoder, getExpense);
router.get("/get/:id", tokenDecoder, getExpenseById);
router.put("/update/:id", tokenDecoder, updateExpense);
router.delete("/delete/:id", tokenDecoder, deleteExpense);

export default router;