import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';

const ExpenseLineChart = () => {
    const { graphExpenses: expenses } = useSelector((state) => state.expense);

    // Process expense data to group by date and sort chronologically
    const chartData = useMemo(() => {
        if (!expenses || expenses.length === 0) return [];

        const dateMap = {};

        expenses.forEach((item) => {
            // Format date to YYYY-MM-DD or similar for grouping
            const date = new Date(item.date).toLocaleDateString();
            if (dateMap[date]) {
                dateMap[date] += Number(item.amount);
            } else {
                dateMap[date] = Number(item.amount);
            }
        });

        return Object.entries(dateMap)
            .map(([date, amount]) => ({
                date,
                amount: parseFloat(amount.toFixed(2)),
                timestamp: new Date(date).getTime()
            }))
            .sort((a, b) => a.timestamp - b.timestamp); // Chronological sort
    }, [expenses]);

    // Custom Tooltip component to match red theme
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 border border-red-600 p-3 rounded-lg shadow-xl shadow-black/50">
                    <p className="text-red-400 font-medium mb-1">{label}</p>
                    <p className="text-red-500 font-bold text-lg">
                        ₹{payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (!chartData || chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-950 rounded-lg border border-red-600">
                <div className="text-center">
                    <p className="text-red-500 italic">No trend data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-950 rounded-lg p-3 border border-red-800 h-full">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-red-600">Expense Trend</h3>
                <p className="text-xs text-red-700 uppercase tracking-widest mt-1">Spending over time</p>
            </div>

            <ResponsiveContainer width="100%" height={340}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#1f2937"
                    />
                    <XAxis
                        dataKey="date"
                        stroke="#991b1b" // red-800
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#991b1b" // red-800
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#f87171" // red-400
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorExpense)"
                        animationDuration={1500}
                        activeDot={{ r: 6, fill: '#f87171', stroke: '#000', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseLineChart;