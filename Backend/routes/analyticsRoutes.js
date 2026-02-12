import express from "express";
import { getSummary, getMonthComparison, getCategoryDistribution, getTrend, getMonthlyComparison, recentTransaction } from "../controllers/anayticsController.js";
import tokenDecoder from "../middleware/authMiddleWare.js";

const router = express.Router()

router.get("/summary", tokenDecoder, getSummary)
router.get("/bar-monthly-comparison", tokenDecoder, getMonthlyComparison)
router.get("/category-distribution", tokenDecoder, getCategoryDistribution)
router.get("/trend", tokenDecoder, getTrend)
router.get("/line-month-comparison", tokenDecoder, getMonthComparison)
router.get("/recent-transaction", tokenDecoder, recentTransaction)

export default router