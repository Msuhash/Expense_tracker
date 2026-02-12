import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';

const IncomePieChart = () => {
  const { graphIncome: income } = useSelector((state) => state.income);
  const [activeIndex, setActiveIndex] = useState(null);

  // Modern gradient color palette (green theme)
  const COLORS = [
    { main: '#4ade80', glow: '#22c55e' }, // green-400 to green-500
    { main: '#22c55e', glow: '#16a34a' }, // green-500 to green-600
    { main: '#34d399', glow: '#10b981' }, // emerald-400 to emerald-500
    { main: '#10b981', glow: '#059669' }, // emerald-500 to emerald-600
    { main: '#86efac', glow: '#4ade80' }, // green-300 to green-400
    { main: '#6ee7b7', glow: '#34d399' }, // emerald-300 to emerald-400
    { main: '#bbf7d0', glow: '#86efac' }, // green-200 to green-300
    { main: '#a7f3d0', glow: '#6ee7b7' }, // emerald-200 to emerald-300
    { main: '#dcfce7', glow: '#bbf7d0' }, // green-100 to green-200
    { main: '#d1fae5', glow: '#a7f3d0' }, // emerald-100 to emerald-200
  ];

  // Process income data to group by category
  const chartData = useMemo(() => {
    if (!income || income.length === 0) return [];

    const categoryMap = {};

    income.forEach((item) => {
      const category = item.category || 'Uncategorized';
      if (categoryMap[category]) {
        categoryMap[category] += Number(item.amount);
      } else {
        categoryMap[category] = Number(item.amount);
      }
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [income]);

  // Calculate total income
  const totalIncome = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0).toFixed(2);
  }, [chartData]);

  // Store label positions to prevent overlaps
  const labelPositions = React.useRef([]);

  // Custom active shape for hover effect
  const renderActiveShape = (props) => {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;

    return (
      <g>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          filter="url(#glow)"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 14}
          fill={fill}
          opacity={0.3}
        />
      </g>
    );
  };

  // Enhanced label renderer with curved connectors
  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload,
  }) => {
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);

    const sx = cx + (outerRadius + 8) * cos;
    const sy = cy + (outerRadius + 8) * sin;
    const mx = cx + (outerRadius + 40) * cos;
    const my = cy + (outerRadius + 40) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 25;
    let ey = my;

    const textAnchor = cos >= 0 ? 'start' : 'end';

    if (percent < 0.001) return null;

    if (index === 0) {
      labelPositions.current = [];
    }

    const labelHeight = 32;
    const minGap = 6;
    const side = cos >= 0 ? 'right' : 'left';
    const sideLabels = labelPositions.current.filter(pos => pos.side === side);

    for (const existingLabel of sideLabels) {
      const distance = Math.abs(ey - existingLabel.y);
      if (distance < labelHeight + minGap) {
        if (ey > existingLabel.y) {
          ey = existingLabel.y + labelHeight + minGap;
        } else {
          ey = existingLabel.y - labelHeight - minGap;
        }
      }
    }

    labelPositions.current.push({ y: ey, side });

    const color = COLORS[index % COLORS.length];
    const isActive = activeIndex === index;

    return (
      <g>
        <defs>
          <linearGradient id={`lineGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color.main} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color.glow} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Curved connector line */}
        <path
          d={`M${sx},${sy} Q${mx},${my} ${ex},${ey}`}
          stroke={`url(#lineGradient${index})`}
          fill="none"
          strokeWidth={isActive ? 2.5 : 1.8}
          opacity={isActive ? 1 : 0.7}
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Glowing dot */}
        <circle
          cx={ex}
          cy={ey}
          r={isActive ? 4 : 3}
          fill={color.glow}
          style={{
            filter: isActive ? 'drop-shadow(0 0 6px ' + color.glow + ')' : 'none',
            transition: 'all 0.3s ease'
          }}
        />

        {/* Category label with background */}
        <rect
          x={ex + (cos >= 0 ? 8 : -8) + (cos >= 0 ? 0 : -payload.name.length * 6.5)}
          y={ey - 18}
          width={payload.name.length * 6.5}
          height={16}
          fill="rgba(0, 0, 0, 0.6)"
          rx="3"
          opacity={isActive ? 0.9 : 0.5}
        />

        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={-10}
          textAnchor={textAnchor}
          fill={color.main}
          fontSize={isActive ? "13" : "11"}
          fontWeight="700"
          style={{
            letterSpacing: '0.5px',
            transition: 'all 0.3s ease',
            fontFamily: "'Inter', 'Segoe UI', sans-serif"
          }}
        >
          {payload.name}
        </text>

        {/* Percentage */}
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={8}
          textAnchor={textAnchor}
          fill={color.glow}
          fontSize={isActive ? "14" : "12"}
          fontWeight="800"
          style={{
            transition: 'all 0.3s ease',
            fontFamily: "'Inter', 'Segoe UI', sans-serif"
          }}
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  // Enhanced tooltip with glassmorphism
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const index = chartData.findIndex(item => item.name === payload[0].name);
      const color = COLORS[index % COLORS.length];

      return (
        <div
          className="rounded-xl p-4 backdrop-blur-md border-2 shadow-2xl"
          style={{
            background: 'rgba(17, 24, 39, 0.85)',
            borderColor: color.glow,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${color.glow}40`
          }}
        >
          <p
            className="font-bold text-base mb-2"
            style={{
              color: color.main
            }}
          >
            {payload[0].name}
          </p>
          <p className="text-green-300 text-sm mb-1">
            Amount: <span className="font-bold text-green-400">₹{payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-green-200 text-xs">
            {((payload[0].value / totalIncome) * 100).toFixed(2)}% of total income
          </p>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 rounded-xl border-2 border-green-500/30 bg-gray-950">

        <div className="text-center relative z-10">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-green-400 text-xl font-bold mb-2">
            No Income Data Available
          </p>
          <p className="text-green-300/70 text-sm">Add income records to visualize your earnings</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5 border-2 shadow-2xl bg-gray-950 border-green-800"
    >

      <div className="mb-4 relative z-10">
        <h3
          className="text-lg font-extrabold mb-3 bg-gradient-to-r from-green-400 via-green-600 to-emerald-500 bg-clip-text text-transparent"
          style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            letterSpacing: '0.5px'
          }}
        >
          💰 Income Distribution by Category
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-green-700 text-sm">Total Income:</span>
          <span
            className="text-xl font-black bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent"
          >
            ₹{Number(totalIncome).toLocaleString()}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <PieChart>
          <defs>
            {chartData.map((entry, index) => {
              const color = COLORS[index % COLORS.length];
              return (
                <linearGradient key={`gradient-${index}`} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color.main} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={color.glow} stopOpacity={0.85} />
                </linearGradient>
              );
            })}
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={95}
            innerRadius={55}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#colorGradient${index})`}
                stroke="rgba(0, 0, 0, 0.3)"
                strokeWidth={2}
                style={{
                  filter: activeIndex === index ? 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.6))' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomePieChart;