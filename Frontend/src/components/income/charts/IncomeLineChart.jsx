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

const IncomeLineChart = () => {
  const { graphIncome: income } = useSelector((state) => state.income);

  // Process income data to group by date and sort chronologically
  const chartData = useMemo(() => {
    if (!income || income.length === 0) return [];

    const dateMap = {};

    income.forEach((item) => {
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
  }, [income]);

  // Custom Tooltip component to match green theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-green-600 p-3 rounded-lg shadow-xl shadow-black/50">
          <p className="text-green-400 font-medium mb-1">{label}</p>
          <p className="text-green-500 font-bold text-lg">
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-950 rounded-lg border border-green-600">
        <div className="text-center">
          <p className="text-green-500 italic">No trend data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 rounded-lg p-3 border border-green-800 h-full">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-green-600">Income Trend</h3>
        <p className="text-xs text-green-700 uppercase tracking-widest mt-1">Growth over time</p>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#1f2937"
          />
          <XAxis
            dataKey="date"
            stroke="#166534" // green-800
            fontSize={10}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#166534" // green-800
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#4ade80" // green-400
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorIncome)"
            animationDuration={1500}
            activeDot={{ r: 6, fill: '#4ade80', stroke: '#000', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeLineChart;