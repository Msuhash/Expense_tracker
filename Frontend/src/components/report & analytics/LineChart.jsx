import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area
} from 'recharts';

const LineChart = () => {
  const { trend, loading, error } = useSelector((state) => state.analytics);

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!trend || !Array.isArray(trend)) return [];
    return trend;
  }, [trend]);

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

  // Custom Legend - Income (green), Expense (orange), Net (amber)
  const CustomLegend = () => {
    const legendItems = [
      { name: 'Income', color: '#22c55e' },
      { name: 'Expense', color: '#ef4444' },
      { name: 'Net', color: '#d97706' }
    ];

    return (
      <div className="flex justify-center gap-8 mt-6">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full shadow-md"
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
          <p className="text-amber-500 italic">Loading trend data...</p>
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
          <p className="text-amber-500 italic">No trend data available</p>
          <p className="text-amber-700 text-sm mt-2">Add some income or expenses to see the trend</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 rounded-lg p-6 border border-amber-800 h-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-amber-600">Financial Trend</h3>
        <p className="text-xs text-amber-700 uppercase tracking-widest mt-1">
          Income, Expense & Net - Last 12 Months
        </p>
      </div>

      <ResponsiveContainer width="100%" height={450}>
        <RechartsLineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            {/* Gradient for Income line */}
            <linearGradient id="incomeLineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            {/* Gradient for Expense line */}
            <linearGradient id="expenseLineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            {/* Gradient for Net line */}
            <linearGradient id="netLineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
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

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d97706', strokeWidth: 2, strokeDasharray: '5 5' }} />

          <Legend content={<CustomLegend />} />

          {/* Income Line */}
          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{
              fill: '#22c55e',
              strokeWidth: 2,
              r: 5,
              stroke: '#16a34a'
            }}
            activeDot={{
              r: 7,
              fill: '#22c55e',
              stroke: '#16a34a',
              strokeWidth: 2
            }}
            animationDuration={1500}
            animationBegin={0}
          />

          {/* Expense Line */}
          <Line
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{
              fill: '#ef4444',
              strokeWidth: 2,
              r: 5,
              stroke: '#dc2626'
            }}
            activeDot={{
              r: 7,
              fill: '#ef4444',
              stroke: '#dc2626',
              strokeWidth: 2
            }}
            animationDuration={1500}
            animationBegin={200}
          />

          {/* Net Line */}
          <Line
            type="monotone"
            dataKey="net"
            name="Net"
            stroke="#d97706"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{
              fill: '#d97706',
              strokeWidth: 2,
              r: 5,
              stroke: '#b45309'
            }}
            activeDot={{
              r: 7,
              fill: '#d97706',
              stroke: '#b45309',
              strokeWidth: 2
            }}
            animationDuration={1500}
            animationBegin={400}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;