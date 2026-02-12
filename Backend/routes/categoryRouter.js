import express from "express";
import { addCategory, getCategory, getCategoryById, deleteCategory, mergeCategory } from "../controllers/categoryController.js";
import tokenDecoder from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/add", tokenDecoder, addCategory);
router.get("/get", tokenDecoder, getCategory);
router.get("/get/:id", tokenDecoder, getCategoryById);
router.delete("/delete/:id", tokenDecoder, deleteCategory);
router.put("/merge/:id", tokenDecoder, mergeCategory);

export default router;