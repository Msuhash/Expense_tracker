import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

const BarChart = () => {
  const { barMonthlyComparison, loading, error } = useSelector((state) => state.analytics);

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!barMonthlyComparison || !Array.isArray(barMonthlyComparison)) return [];
    return barMonthlyComparison;
  }, [barMonthlyComparison]);

  // Custom Tooltip component with amber/orange theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-amber-600 p-4 rounded-lg shadow-xl shadow-black/50">
          <p className="text-amber-400 font-bold mb-2 text-lg">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="text-sm font-bold" style={{ color: entry.color }}>
                ₹{entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Legend - explicitly ordered: Income (green) first, Expense (orange) second
  const CustomLegend = () => {
    const legendItems = [
      { name: 'Income', color: '#22c55e' },
      { name: 'Expense', color: '#f97316' }
    ];

    return (
      <div className="flex justify-center gap-8 mt-6">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded shadow-md"
              style={{
                background: item.color,
                boxShadow: `0 0 8px ${item.color}40`
              }}
            />
            <span className="text-base font-semibold" style={{ color: item.color }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-950 rounded-lg border border-amber-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-500 italic">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-950 rounded-lg border border-red-600">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Error loading data</p>
          <p className="text-red-400 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-950 rounded-lg border border-amber-600">
        <div className="text-center">
          <p className="text-amber-500 italic">No comparison data available</p>
          <p className="text-amber-700 text-sm mt-2">Add some income or expenses to see the chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 rounded-lg p-6 border border-amber-800 h-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-amber-600">Monthly Comparison</h3>
        <p className="text-xs text-amber-700 uppercase tracking-widest mt-1">
          Income vs Expense - Last 12 Months
        </p>
      </div>

      <ResponsiveContainer width="100%" height={450}>
        <RechartsBarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            {/* Gradient for Income bars */}
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0.7} />
            </linearGradient>
            {/* Gradient for Expense bars */}
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#ea580c" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#374151"
            opacity={0.3}
          />

          <XAxis
            dataKey="month"
            stroke="#d97706" // amber-600
            fontSize={12}
            fontWeight={600}
            tickLine={false}
            axisLine={{ stroke: '#92400e', strokeWidth: 2 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />

          <YAxis
            stroke="#d97706" // amber-600
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#92400e', strokeWidth: 2 }}
            tickFormatter={(value) => `₹${value.toLocaleString()}`}
            width={80}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(217, 119, 6, 0.1)' }} />

          <Legend content={<CustomLegend />} />

          <Bar
            dataKey="income"
            name="Income"
            fill="url(#incomeGradient)"
            radius={[8, 8, 0, 0]}
            animationDuration={1500}
            animationBegin={0}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-income-${index}`}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </Bar>

          <Bar
            dataKey="expense"
            name="Expense"
            fill="url(#expenseGradient)"
            radius={[8, 8, 0, 0]}
            animationDuration={1500}
            animationBegin={200}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-expense-${index}`}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;