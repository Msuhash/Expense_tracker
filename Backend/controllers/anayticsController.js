
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import mongoose from "mongoose";

// Helper to get month name
const getMonthName = (monthIndex) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[monthIndex - 1] || "";
};

export const recentTransaction = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const transaction = await Income.aggregate([
            {
                $match: { userId }
            },
            {
                $addFields: {
                    type: "income"
                }
            },
            {
                $unionWith: {
                    coll: "expenses",
                    pipeline: [
                        {
                            $match: { userId }
                        },
                        {
                            $addFields: {
                                type: "expense"
                            }
                        }
                    ]
                }
            },
            {
                $sort: {
                    date: -1
                }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    amount: 1,
                    date: 1,
                    type: 1,
                    category: 1,
                    description: 1,
                }
            }
        ])

        return res.status(200).json(transaction)

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message })
    }
}


// 1️⃣ GET /api/analytics/summary
export const getSummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        // const currentYear = new Date().getFullYear();

        const matchStage = {
            $match: {
                userId: userId,
                // $expr: { $eq: [{ $year: "$date" }, currentYear] }
            }
        };

        const [incomeSummary, expenseSummary, topIncome, topExpense] = await Promise.all([
            Income.aggregate([
                matchStage,
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Expense.aggregate([
                matchStage,
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            Income.aggregate([
                matchStage,
                { $group: { _id: "$category", total: { $sum: "$amount" } } },
                { $sort: { total: -1 } },
                { $limit: 1 }
            ]),
            Expense.aggregate([
                matchStage,
                { $group: { _id: "$category", total: { $sum: "$amount" } } },
                { $sort: { total: -1 } },
                { $limit: 1 }
            ])
        ]);

        const totalIncome = incomeSummary[0]?.total || 0;
        const totalExpense = expenseSummary[0]?.total || 0;
        const net = totalIncome - totalExpense;
        const profitPercentage = totalIncome > 0 ? (net / totalIncome) * 100 : 0;

        res.status(200).json({
            totalIncome,
            totalExpense,
            net,
            profitPercentage: parseFloat(profitPercentage.toFixed(2)),
            topIncomeCategory: topIncome[0] ? { category: topIncome[0]._id, amount: topIncome[0].total } : { category: "N/A", amount: 0 },
            topExpenseCategory: topExpense[0] ? { category: topExpense[0]._id, amount: topExpense[0].total } : { category: "N/A", amount: 0 }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 2️⃣ GET /api/analytics/bar-monthly-comparison
export const getMonthlyComparison = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Calculate date 12 months ago
        const today = new Date();
        const pastDate = new Date();
        pastDate.setMonth(today.getMonth() - 12);
        pastDate.setDate(1);

        const pipeline = [
            {
                $match: {
                    userId: userId,
                    date: { $gte: pastDate, $lte: today }
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ];

        const [incomeResults, expenseResults] = await Promise.all([
            Income.aggregate(pipeline),
            Expense.aggregate(pipeline)
        ]);

        const comparison = [];
        for (let i = 0; i < 12; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1);
            const year = d.getFullYear();
            const month = d.getMonth() + 1; // 1-based for DB match
            console.log(year, month);
            const incomeData = incomeResults.find(r => r._id.year === year && r._id.month === month);
            const expenseData = expenseResults.find(r => r._id.year === year && r._id.month === month);

            comparison.push({
                month: getMonthName(month),
                income: incomeData ? incomeData.total : 0,
                expense: expenseData ? expenseData.total : 0
            });
        }

        res.status(200).json(comparison);

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 3️⃣ GET /api/analytics/category-distribution
export const getCategoryDistribution = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        // const currentYear = new Date().getFullYear();

        const pipeline = [
            {
                $match: {
                    userId: userId,
                    // $expr: { $eq: [{ $year: "$date" }, currentYear] }
                }
            },
            {
                $group: {
                    _id: "$category",
                    amount: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    amount: 1
                }
            }
        ];

        const [incomeCategories, expenseCategories] = await Promise.all([
            Income.aggregate(pipeline),
            Expense.aggregate(pipeline)
        ]);

        res.status(200).json({
            incomeCategories,
            expenseCategories
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 4️⃣ GET /api/analytics/trend
export const getTrend = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const today = new Date();
        const pastDate = new Date();
        pastDate.setMonth(today.getMonth() - 11); // Last 12 months including current
        pastDate.setDate(1);

        const pipeline = [
            {
                $match: {
                    userId: userId,
                    date: { $gte: pastDate, $lte: today }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ];

        const [incomeResults, expenseResults] = await Promise.all([
            Income.aggregate(pipeline),
            Expense.aggregate(pipeline)
        ]);

        const trend = [];
        // Generate last 12 months chronologically
        for (let i = 0; i < 12; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1);
            const year = d.getFullYear();
            const month = d.getMonth() + 1; // 1-based for DB match

            const incomeData = incomeResults.find(r => r._id.year === year && r._id.month === month);
            const expenseData = expenseResults.find(r => r._id.year === year && r._id.month === month);

            const income = incomeData ? incomeData.total : 0;
            const expense = expenseData ? expenseData.total : 0;

            trend.push({
                month: getMonthName(month),
                year: year, // Helpful for frontend to distinguish Jan 2025 vs Jan 2026
                income,
                expense,
                net: income - expense
            });
        }

        res.status(200).json(trend);

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 5️⃣ GET /api/analytics/line-month-comparison
export const getMonthComparison = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const { month1, month2 } = req.query; // Expect YYYY-MM

        if (!month1 || !month2) {
            return res.status(400).json({ message: "Both month1 and month2 are required" });
        }

        const getMonthDataArray = async (monthStr) => {
            const [year, month] = monthStr.split("-").map(Number);
            const start = new Date(Date.UTC(year, month - 1, 1));
            const end = new Date(Date.UTC(year, month, 1));

            const pipeline = [
                {
                    $match: {
                        userId: userId,
                        date: { $gte: start, $lt: end }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ];

            const [incomeResult, expenseResult] = await Promise.all([
                Income.aggregate(pipeline),
                Expense.aggregate(pipeline)
            ]);

            const income = incomeResult.length > 0 ? incomeResult[0].total : 0;
            const expense = expenseResult.length > 0 ? expenseResult[0].total : 0;

            return {
                income,
                expense,
                net: income - expense
            };
        };

        const [data1, data2] = await Promise.all([
            getMonthDataArray(month1),
            getMonthDataArray(month2)
        ]);

        res.status(200).json({
            month1: data1,
            month2: data2
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
