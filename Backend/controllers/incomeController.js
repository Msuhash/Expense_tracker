import Income from "../models/Income.js";
import User from "../models/userModel.js";

export const addIncome = async (req, res) => {

    const { amount, category, description, date } = req.body;

    if (!amount || !category || !date) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const income = new Income({
            amount,
            category,
            description,
            date,
            userId: user.id
        });
        await income.save();
        res.status(201).json({ message: "Income added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getIncome = async (req, res) => {
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
        const totalCount = await Income.countDocuments(filter);

        // Fetch paginated income records
        const income = await Income.find(filter)
            .sort({ date: -1 }) // Sort by date descending (newest first)
            .skip(skip)
            .limit(limitNum);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limitNum);
        const hasMore = pageNum < totalPages;

        res.status(200).json({
            data: income,
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

export const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
        res.status(200).json({ message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateIncome = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "At least one field is required to update" });
    }
    try {
        const income = await Income.findOneAndUpdate({
            _id: req.params.id,
            userId: req.user.id
        }, req.body, { new: true, runValidators: true });
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
        res.status(200).json({message: "Income updated successfully"}, income);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getIncomeById = async (req, res) => {
    try {
        const income = await Income.findById({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

