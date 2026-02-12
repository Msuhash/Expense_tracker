import Expense from "../models/Expense.js";
import User from "../models/userModel.js";
import Budget from "../models/budgetModel.js";

export const addExpense = async (req, res) => {

    const { amount, category, description, date } = req.body;

    if (!amount || !category || !date) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const expense = new Expense({
            amount,
            category,
            description,
            date,
            userId: user.id
        });
        await expense.save();
        res.status(201).json({ message: "Expense added successfully" });

        const budget = await Budget.findOne({
            userId: req.user.id,
            category: expense.category,
            startDate: {$lte: expense.date},
            endDate: {$gte: expense.date}
        })

        if (budget) {
            budget.amount += amount;
            await budget.save();   
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getExpense = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract query parameters for filtering and pagination
        const {
            category,
            minAmount,
            maxAmount,
            startDate,
            endDate,
            search,
            page = 1,
            limit = 10
        } = req.query;

        // Build filter object
        const filter = { userId: user.id };

        // Filter by search text (searches in description and category)
        if (search) {
            filter.$or = [
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by amount range
        if (minAmount || maxAmount) {
            filter.amount = {};
            if (minAmount) {
                filter.amount.$gte = Number(minAmount);
            }
            if (maxAmount) {
                filter.amount.$lte = Number(maxAmount);
            }
        }

        // Filter by date range
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) {
                filter.date.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.date.$lte = new Date(endDate);
            }
        }

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Get total count for pagination metadata
        const totalCount = await Expense.countDocuments(filter);

        // Fetch paginated expense records
        const expense = await Expense.find(filter)
            .sort({ date: -1 }) // Sort by date descending (newest first)
            .skip(skip)
            .limit(limitNum);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limitNum);
        const hasMore = pageNum < totalPages;

        res.status(200).json({
            data: expense,
            pagination: {
                total: totalCount,
                totalPages,
                currentPage: pageNum,
                limit: limitNum,
                hasMore
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
       
        const budget = await Budget.findOne({
            userId: req.user.id,
            category: expense.category,
            startDate: {$lte: expense.date},
            endDate: {$gte: expense.date}
        })
        if (budget) {
            budget.amount = Math.max(0, budget.amount - expense.amount);
            await budget.save();
        }
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateExpense = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "At least one field is required to update" });
    }
    try {
        const oldExpense = await Expense.findOne({
            _id: req.params.id,
            userId: req.user.id
        })

        if(!oldExpense){
            return res.status(404).json({ message: "Expense not found" });
        }

        const expense = await Expense.findOneAndUpdate({
            _id: req.params.id,
            userId: req.user.id
        }, req.body, { new: true, runValidators: true });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        const updateAmount = oldExpense.amount !== expense.amount;
        const updateCategory = oldExpense.category !== expense.category;
        const updateDate = oldExpense.date.getTime() !== expense.date.getTime();

        if(!updateAmount && !updateCategory && !updateDate){
            return res.status(200).json({ message: "Expense updated successfully", expense });
        }

        if(updateAmount && !updateCategory && !updateDate){

            const diffAmount = expense.amount - oldExpense.amount;

            const budget = await Budget.findOne({
                userId: req.user.id,
                category: expense.category,
                startDate: {$lte: expense.date},
                endDate: {$gte: expense.date}
            })

            if(budget){
                budget.amount += diffAmount;
                await budget.save();
                return res.status(200).json({message: "budget updated successfully"});
            }
        }

        if(updateCategory || updateDate){
            const budget = await Budget.findOne({
                userId: req.user.id,
                category: oldExpense.category,
                startDate: {$lte: oldExpense.date},
                endDate: {$gte: oldExpense.date}
            })

            if(budget){
                budget.amount -= oldExpense.amount;
                await budget.save();
                return res.status(200).json({message: "budget updated successfully"});
            }

            const budget2 = await Budget.findOne({
                userId: req.user.id,
                category: expense.category,
                startDate: {$lte: expense.date},
                endDate: {$gte: expense.date}
            })

            if(budget2){
                budget2.amount += expense.amount;
                await budget2.save();
                return res.status(200).json({message: "budget updated successfully"});
            }
        }


        res.status(200).json({message: "Expense updated successfully"}, expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
