import express from "express";
import { addIncome, deleteIncome, getIncome, getIncomeById, updateIncome } from "../controllers/incomeController.js";
import tokenDecoder from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/add", tokenDecoder, addIncome);
router.get("/get", tokenDecoder, getIncome);
router.get("/get/:id", tokenDecoder, getIncomeById);
router.put("/update/:id", tokenDecoder, updateIncome);
router.delete("/delete/:id", tokenDecoder, deleteIncome);

export default router;