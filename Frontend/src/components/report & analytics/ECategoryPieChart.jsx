import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const ECategoryPieChart = () => {
  const { categoryDistribution, loading, error } = useSelector((state) => state.analytics);

  // Color palette for expense categories (reds and oranges)
  const COLORS = ['#ef4444', '#dc2626', '#f97316', '#ea580c', '#fb923c', '#f59e0b', '#fbbf24', '#fcd34d'];

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!categoryDistribution || !categoryDistribution.expenseCategories) return [];

    const data = categoryDistribution.expenseCategories.map((item, index) => ({
      name: item.category,
      value: item.amount,
      color: COLORS[index % COLORS.length]
    }));

    return data;
  }, [categoryDistribution]);

  // Calculate total for percentages
  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  // Custom label to show percentage
  const renderLabel = (entry) => {
    const percent = ((entry.value / total) * 100).toFixed(1);
    return `${percent}%`;
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-gray-900 border border-amber-600 p-4 rounded-lg shadow-xl shadow-black/50">
          <p className="text-amber-400 font-bold mb-2">{data.name}</p>
          <p className="text-red-400 font-semibold">
            ₹{data.value.toLocaleString()}
          </p>
          <p className="text-amber-600 text-sm">
            {percent}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4 max-h-[150px] overflow-y-auto">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{
                backgroundColor: entry.color,
                boxShadow: `0 0 6px ${entry.color}40`
              }}
            />
            <span className="text-xs text-amber-600 truncate">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-[400px] bg-gray-950 rounded-lg border border-amber-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-500 italic">Loading expense data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full min-h-[400px] bg-gray-950 rounded-lg border border-red-600">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Error loading data</p>
          <p className="text-red-400 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center w-full min-h-[400px] bg-gray-950 rounded-lg border border-amber-600">
        <div className="text-center">
          <p className="text-amber-500 italic">No expense data available</p>
          <p className="text-amber-700 text-sm mt-2">Add some expenses to see the distribution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 rounded-lg p-6 border border-amber-800 w-full">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-red-500">Expense Distribution</h3>
        <p className="text-xs text-amber-700 uppercase tracking-widest mt-1">
          By Category
        </p>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1500}
            animationBegin={0}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                className="hover:opacity-80 transition-opacity duration-200"
                stroke="#000"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 text-center">
        <p className="text-amber-600 font-semibold">
          Total Expenses: <span className="text-red-500">₹{total.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
};

export default ECategoryPieChart;