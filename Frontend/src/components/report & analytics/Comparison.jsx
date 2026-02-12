import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLineMonthlyComparison } from '../../store/slices/analyticsSlice';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { format } from 'date-fns';

const Comparison = () => {
  const dispatch = useDispatch();
  const { lineMonthlyComparison, loading, error } = useSelector((state) => state.analytics);

  // Get current month and previous month as defaults
  const getCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const getPreviousMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1, 1);
  };

  const [month1, setMonth1] = useState(getPreviousMonth());
  const [month2, setMonth2] = useState(getCurrentMonth());
  const [openMonth1, setOpenMonth1] = useState(false);
  const [openMonth2, setOpenMonth2] = useState(false);

  // Format month for API (YYYY-MM)
  const formatMonthForAPI = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  // Fetch comparison data when months change
  useEffect(() => {
    if (month1 && month2) {
      dispatch(fetchLineMonthlyComparison({
        month1: formatMonthForAPI(month1),
        month2: formatMonthForAPI(month2)
      }));
    }
  }, [month1, month2, dispatch]);

  // Process data for the chart
  const chartData = useMemo(() => {
    if (!lineMonthlyComparison || !lineMonthlyComparison.month1 || !lineMonthlyComparison.month2) {
      return [];
    }

    const month1Label = month1 ? format(month1, 'MMM yyyy') : 'Month 1';
    const month2Label = month2 ? format(month2, 'MMM yyyy') : 'Month 2';

    return [
      {
        category: 'Income',
        [month1Label]: lineMonthlyComparison.month1.income || 0,
        [month2Label]: lineMonthlyComparison.month2.income || 0,
        color1: '#22c55e',
        color2: '#16a34a'
      },
      {
        category: 'Expense',
        [month1Label]: lineMonthlyComparison.month1.expense || 0,
        [month2Label]: lineMonthlyComparison.month2.expense || 0,
        color1: '#ef4444',
        color2: '#dc2626'
      },
      {
        category: 'Net',
        [month1Label]: lineMonthlyComparison.month1.net || 0,
        [month2Label]: lineMonthlyComparison.month2.net || 0,
        color1: '#d97706',
        color2: '#b45309'
      }
    ];
  }, [lineMonthlyComparison, month1, month2]);

  // Custom Tooltip
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

  // Custom Legend
  const CustomLegend = () => {
    const month1Label = month1 ? format(month1, 'MMM yyyy') : 'Month 1';
    const month2Label = month2 ? format(month2, 'MMM yyyy') : 'Month 2';

    const legendItems = [
      { name: month1Label, color: '#d97706' },
      { name: month2Label, color: '#b45309' }
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
          <p className="text-amber-500 italic">Loading comparison data...</p>
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

  const month1Label = month1 ? format(month1, 'MMM yyyy') : 'Month 1';
  const month2Label = month2 ? format(month2, 'MMM yyyy') : 'Month 2';

  return (
    <div className="bg-gray-950 rounded-lg p-6 border border-amber-800 h-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-amber-600">Month Comparison</h3>
        <p className="text-xs text-amber-700 uppercase tracking-widest mt-1">
          Compare Income, Expense & Net Between Two Months
        </p>
      </div>

      {/* Month Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
        <div className="flex items-center gap-3">
          <label className="text-amber-600 font-semibold text-sm">Month 1:</label>
          <Popover open={openMonth1} onOpenChange={setOpenMonth1}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] h-10 bg-black border-amber-800 text-amber-700 hover:bg-amber-800/10 hover:text-amber-600 justify-between font-normal"
              >
                <CalendarIcon className="h-4 w-4" />
                {month1 ? format(month1, 'MMMM yyyy') : "Select month"}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 overflow-hidden bg-black border-2 border-amber-800" align="start">
              <Calendar
                mode="single"
                selected={month1}
                onSelect={(date) => {
                  if (date) {
                    // Set to first day of selected month
                    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    setMonth1(firstDay);
                  }
                  setOpenMonth1(false);
                }}
                className="bg-black text-amber-700 rounded-md w-[280px]"
                captionLayout="dropdown"
                fromYear={2020}
                toYear={new Date().getFullYear() + 1}
                disabled={false}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-amber-600 font-semibold text-sm">Month 2:</label>
          <Popover open={openMonth2} onOpenChange={setOpenMonth2}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] h-10 bg-black border-amber-800 text-amber-700 hover:bg-amber-800/10 hover:text-amber-600 justify-between font-normal"
              >
                <CalendarIcon className="h-4 w-4" />
                {month2 ? format(month2, 'MMMM yyyy') : "Select month"}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 overflow-hidden bg-black border-2 border-amber-800" align="start">
              <Calendar
                mode="single"
                selected={month2}
                onSelect={(date) => {
                  if (date) {
                    // Set to first day of selected month
                    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                    setMonth2(firstDay);
                  }
                  setOpenMonth2(false);
                }}
                className="bg-black text-amber-700 rounded-md w-[280px]"
                captionLayout="dropdown"
                fromYear={2020}
                toYear={new Date().getFullYear() + 1}
                disabled={false}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              {/* Gradients for Month 1 bars */}
              <linearGradient id="month1Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#b45309" stopOpacity={0.7} />
              </linearGradient>
              {/* Gradients for Month 2 bars */}
              <linearGradient id="month2Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b45309" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#92400e" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#374151"
              opacity={0.3}
            />

            <XAxis
              dataKey="category"
              stroke="#d97706"
              fontSize={12}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#92400e', strokeWidth: 2 }}
            />

            <YAxis
              stroke="#d97706"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#92400e', strokeWidth: 2 }}
              tickFormatter={(value) => `₹${value.toLocaleString()}`}
              width={80}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(217, 119, 6, 0.1)' }} />

            <Legend content={<CustomLegend />} />

            <Bar
              dataKey={month1Label}
              fill="url(#month1Gradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationBegin={0}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-month1-${index}`}
                  fill={entry.color1}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Bar>

            <Bar
              dataKey={month2Label}
              fill="url(#month2Gradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              animationBegin={200}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-month2-${index}`}
                  fill={entry.color2}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[450px]">
          <div className="text-center">
            <p className="text-amber-500 italic">No comparison data available</p>
            <p className="text-amber-700 text-sm mt-2">Select two months to compare</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comparison;