import Budget from "../models/budgetModel.js";
import User from "../models/userModel.js"
import Expense from "../models/Expense.js"

export const createBudget = async (req, res) => {
    const { category, startDate, endDate, limit } = req.body;
    if (!category || !startDate || !endDate || !limit || limit <= 1) {
        return res.status(400).json({ message: "All fields are required" });
    }
    console.log("req.body", req.body)


    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const expense = await Expense.aggregate([
            {
                $match: {
                    userId: user._id,
                    category: category,
                    date: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ])

        const totalExpense = expense[0]?.total || 0;

        const budget = new Budget({
            userId: user.id,
            category,
            startDate,
            endDate,
            limit,
            amount: totalExpense
        })

        await budget.save();
        res.status(201).json({ messgae: "Budget added Successfully" })
        console.log("Added budget", budget)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("error in adding budget", error.message)
    }
}

export const getBudget = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ messgae: "User not found" })
            console.log("user not found")
        }

        const budget = await Budget.find({ userId: user.id })
        res.status(200).json(budget)
        console.log("get budget", budget)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("error in getting budget", error.message)
    }
}

export const deleteBudget = async (req, res) => {

    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!budget) {
            return res.status(404).json({ messgae: "Budget not found" })
        }
        res.status(200).json({ message: "Budget deleted successfully" })
        console.log("deleted budget", budget)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("error in deleting budget", error.message)
    }
}

export const budgetSummary = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const budget = await Budget.find({ userId: user.id })
        if (budget.length === 0) {
            return res.status(200).json({
                totalBudget: 0,
                totalExpense: 0,
                activeBudget: 0,
                completedBudget: 0,
                budgetSucceed: 0,
                budgetFailed: 0
            })
        }

        const totalBudget = budget.reduce((acc, budget) => acc + budget.limit, 0)
        const totalExpense = budget.reduce((acc, budget) => acc + budget.amount, 0)
        const activeBudget = budget.filter((budget) => budget.startDate <= new Date() && budget.endDate >= new Date() && budget.amount < budget.limit).length
        const completedBudget = budget.filter((budget) => budget.endDate < new Date() || budget.amount >= budget.limit).length
        const budgetSucceed = budget.filter((budget) => budget.amount <= budget.limit && budget.endDate < new Date()).length
        const budgetFailed = budget.filter((budget) => budget.amount > budget.limit).length

        res.status(200).json({
            totalBudget,
            totalExpense,
            activeBudget,
            completedBudget,
            budgetSucceed,
            budgetFailed
        })
        console.log("budget summary", budget)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("error in budget summary", error.message)
    }
}

export const updateBudget = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "At least one filed is required to update" })
    }

    try {
        const budget = await Budget.findOneAndUpdate({
            _id: req.params.id,
            userId: req.user.id,
        }, req.body, { new: true, runValidators: true })
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" })
        }
        res.status(200).json({ message: "Budget updated successfully", budget })
        console.log("updated budget", budget)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("error in updating budget", error.message)
    }
}

// export const updateBudgetAmount = async(req,res) => {
//     const {amount} = req.body;
//     if(amount === undefined || isNaN(amount)){
//         return res.status(400).json({message: "Amount is required"})
//     }

//     try{
//         const budget = await Budget.findOne({
//             _id: req.params.id,
//             userId: req.user.id,
//         })
//         if(!budget){
//             return res.status(404).json({message: "Budget not found"})
//         }

//         const numericAmount = Number(amount);

//         budget.amount = numericAmount + budget.amount;
//         await budget.save();
//         res.status(200).json({message: "Budget updated successfully"})
//         console.log("updated budget", budget)
//     }catch(error){
//         res.status(500).json({message: error.message})
//         console.log("error in updating budget", error.message)
//     }
// }