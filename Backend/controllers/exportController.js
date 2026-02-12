import PDFDocument from "pdfkit";
import { Parser } from "json2csv";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import Budget from "../models/budgetModel.js";

export const exportData = async (req, res) => {
    const { types, format } = req.body;
    const userId = req.user.id;

    if (!types || !Array.isArray(types) || types.length === 0) {
        return res.status(400).json({ message: "Please select at least one type" })
    }

    if (!format || !["pdf", "excel"].includes(format)) {
        return res.status(400).json({ message: "Invalid format selected" })
    }

    try {
        const data = {}

        if (types.includes("income")) {
            data.income = await Income.find({ userId }).lean()
        }

        if (types.includes("expense")) {
            data.expense = await Expense.find({ userId }).lean()
        }

        if (types.includes("budget")) {
            data.budget = await Budget.find({ userId }).lean()
        }

        if (format === "excel") {
            let csvSections = []

            if (data.income && data.income.length > 0) {
                const parser = new Parser({ fields: ["date", "amount", "category", "description"] });
                csvSections.push("INCOME\n" + parser.parse(data.income))
            }

            if (data.expense && data.expense.length > 0) {
                const parser = new Parser({ fields: ["date", "amount", "category", "description"] });
                csvSections.push("\n\nEXPENSE\n" + parser.parse(data.expense))
            }

            if (data.budget && data.budget.length > 0) {
                const parser = new Parser({ fields: ["category", "limit", "amount", "description", "startDate", "endDate"] });
                csvSections.push("\n\nBUDGET\n" + parser.parse(data.budget))
            }

            const csv = csvSections.join("\n")
            res.header("Content-Type", "text/csv")
            res.attachment("expense-tracker-export.csv")
            return res.status(200).send(csv)
        }

        // ===== PDF EXPORT =====
        if (format === "pdf") {
            const doc = new PDFDocument({ margin: 30 });

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=expense-tracker-export.pdf");

            doc.pipe(res);

            doc.fontSize(20).text("Financial Report", { align: "center" });
            doc.moveDown();

            const addSection = (title, records, fields) => {
                if (!records || records.length === 0) return;

                doc.fontSize(16).text(title, { underline: true });
                doc.moveDown(0.5);

                records.forEach((item) => {
                    const line = fields.map(f => `${f}: ${item[f] || 'N/A'}`).join(" | ");
                    doc.fontSize(10).text(line);
                });

                doc.moveDown();
            };

            if (data.income) {
                addSection("Income", data.income, ["date", "category", "amount", "description"]);
            }

            if (data.expense) {
                addSection("Expense", data.expense, ["date", "category", "amount", "description"]);
            }

            if (data.budget) {
                addSection("Budget", data.budget, ["category", "limit", "amount", "startDate", "endDate"]);
            }

            doc.end();
            return;
        }

        return res.status(400).json({ message: "Invalid format selected" });

    } catch (error) {
        console.error("Export error:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}