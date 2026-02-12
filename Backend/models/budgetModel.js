import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true,
        default: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    limit: {
        type: Number,
        min: 1,
        required: true,
        trim: true
    }
}, { timestamps: true })

const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);

export default Budget;