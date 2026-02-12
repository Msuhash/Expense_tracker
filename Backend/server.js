import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import cookieParser from "cookie-parser";
import userRouters from "./routes/userRouters.js";
import incomeRouter from "./routes/incomeRouter.js";
import expenseRouter from "./routes/expenseRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import budgetRouter from "./routes/budgetRoutes.js";
import exportRouter from "./routes/exportRouter.js";

dotenv.config()


const app = express();
const PORT = process.env.PORT || 5000;

//middleware to handle cors

app.use(
    cors({
        origin: [process.env.CLIENT_URL, "http://localhost:5174", "https://expense-tracker-swart-eta.vercel.app"],
        methods: ["POST", "PUT", "DELETE", "GET"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
)

connectDB()

app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRouters)
app.use("/api/income", incomeRouter)
app.use("/api/expense", expenseRouter)
app.use("/api/category", categoryRouter)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/budget", budgetRouter)
app.use("/api/export", exportRouter)

app.listen(PORT, () => { console.log(`server is running successfully ${PORT}`) })

app.get("/", (req, res) => {
  res.send("Expense Tracker API Running");
});
