import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true,
        maxlength: 100,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    type: {
        type: String,
        default: "income"
    }
}, { timestamps: true })

const Income = mongoose.models.Income || mongoose.model("Income", incomeSchema);

export default Income
