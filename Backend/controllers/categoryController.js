import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
import Budget from "../models/budgetModel.js";

export const addCategory = async (req, res) => {
    const { name, type, description, icon, color } = req.body;
    if (!name || !type || !icon || !color) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const category = new Category({
            name,
            type,
            description,
            icon,
            color,
            userId: user.id
        });
        await category.save();
        res.status(201).json({ message: "Category added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCategory = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const category = await Category.find({ $or: [{ userId: user.id }, { userId: { $exists: false } }, { userId: null }] }).sort({ name: 1 });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (category.isDefault) {
            return res.status(400).json({ message: "Default category cannot be deleted" });
        }

        const expense = await Expense.countDocuments({
            userId: req.user.id,
            category: category.name
        });
        const income = await Income.countDocuments({
            userId: req.user.id,
            category: category.name
        });
        const budget = await Budget.countDocuments({
            userId: req.user.id,
            category: category.name
        });
        if (expense > 0 || income > 0 || budget > 0) {
            return res.status(400).json({ message: "Category is used in transactions", expense, income, budget });
        }

        await Category.deleteOne({
            _id: req.params.id,
            userId: req.user.id
        });

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const mergeCategory = async (req, res) => {
    const { targetCategoryId } = req.body; // category to move INTO

    if (!targetCategoryId) {
        return res.status(400).json({ message: "Target category is required" });
    }

    try {
        const sourceCategory = await Category.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!sourceCategory) {
            return res.status(404).json({ message: "Source category not found" });
        }

        if (sourceCategory.isDefault) {
            return res.status(400).json({ message: "Default category cannot be merged" });
        }

        const targetCategory = await Category.findOne({
            _id: targetCategoryId,
            userId: req.user.id
        });

        if (!targetCategory) {
            return res.status(404).json({ message: "Target category not found" });
        }

        if (sourceCategory.type !== targetCategory.type) {
            return res.status(400).json({ message: "Cannot merge income and expense categories" });
        }

        // Move transactions
        if (sourceCategory.type === "expense") {
            await Expense.updateMany(
                { userId: req.user.id, category: sourceCategory.name },
                { $set: { category: targetCategory.name } }
            );

            await Budget.updateMany(
                { userId: req.user.id, category: sourceCategory.name },
                { $set: { category: targetCategory.name } }
            );
        }

        if (sourceCategory.type === "income") {
            await Income.updateMany(
                { userId: req.user.id, category: sourceCategory.name },
                { $set: { category: targetCategory.name } }
            );
        }

        // Delete old category
        await sourceCategory.deleteOne();

        res.status(200).json({ message: "Category merged successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
