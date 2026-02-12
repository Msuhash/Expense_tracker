import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';

const ExpensePieChart = () => {
    const { graphExpenses: expenses } = useSelector((state) => state.expense);
    const [activeIndex, setActiveIndex] = useState(null);

    // Modern gradient color palette for expenses (red/orange theme)
    const COLORS = [
        { main: '#f87171', glow: '#ef4444' }, // red-400 to red-500
        { main: '#ef4444', glow: '#dc2626' }, // red-500 to red-600
        { main: '#fb923c', glow: '#f97316' }, // orange-400 to orange-500
        { main: '#f97316', glow: '#ea580c' }, // orange-500 to orange-600
        { main: '#fca5a5', glow: '#f87171' }, // red-300 to red-400
        { main: '#fdba74', glow: '#fb923c' }, // orange-300 to orange-400
        { main: '#fecaca', glow: '#fca5a5' }, // red-200 to red-300
        { main: '#fed7aa', glow: '#fdba74' }, // orange-200 to orange-300
        { main: '#fee2e2', glow: '#fecaca' }, // red-100 to red-200
        { main: '#ffedd5', glow: '#fed7aa' }, // orange-100 to orange-200
    ];

    // Process expense data to group by category
    const chartData = useMemo(() => {
        if (!expenses || expenses.length === 0) return [];

        const categoryMap = {};

        expenses.forEach((item) => {
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
    }, [expenses]);

    // Calculate total expenses
    const totalExpenses = useMemo(() => {
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
                    <filter id="glow-expense">
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
                    filter="url(#glow-expense)"
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
                    <linearGradient id={`lineGradient-expense-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color.main} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color.glow} stopOpacity="0.9" />
                    </linearGradient>
                </defs>

                {/* Curved connector line */}
                <path
                    d={`M${sx},${sy} Q${mx},${my} ${ex},${ey}`}
                    stroke={`url(#lineGradient-expense-${index})`}
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
                    <p className="text-red-300 text-sm mb-1">
                        Amount: <span className="font-bold text-red-400">₹{payload[0].value.toLocaleString()}</span>
                    </p>
                    <p className="text-red-200 text-xs">
                        {((payload[0].value / totalExpenses) * 100).toFixed(2)}% of total expenses
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
            <div className="flex items-center justify-center h-96 rounded-xl border-2 border-red-500/30 bg-gray-950">
                <div className="text-center relative z-10">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-red-400 text-xl font-bold mb-2">
                        No Expense Data Available
                    </p>
                    <p className="text-red-300/70 text-sm">Add expense records to visualize your spending</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="rounded-xl p-5 border-2 shadow-2xl bg-gray-950 border-red-800"
        >
            <div className="mb-4 relative z-10">
                <h3
                    className="text-lg font-extrabold mb-3 bg-gradient-to-r from-red-600 via-red-700 to-orange-500 bg-clip-text text-transparent"
                    style={{
                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                        letterSpacing: '0.5px'
                    }}
                >
                    💸 Expense Distribution by Category
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-red-700 text-sm">Total Expenses:</span>
                    <span
                        className="text-xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent"
                    >
                        ₹{Number(totalExpenses).toLocaleString()}
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                    <defs>
                        {chartData.map((entry, index) => {
                            const color = COLORS[index % COLORS.length];
                            return (
                                <linearGradient key={`gradient-expense-${index}`} id={`colorGradient-expense-${index}`} x1="0" y1="0" x2="0" y2="1">
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
                                fill={`url(#colorGradient-expense-${index})`}
                                stroke="rgba(0, 0, 0, 0.3)"
                                strokeWidth={2}
                                style={{
                                    filter: activeIndex === index ? 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))' : 'none',
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

export default ExpensePieChart;