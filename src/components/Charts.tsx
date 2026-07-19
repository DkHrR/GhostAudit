import React from 'react';

// 1. Radial Progress Chart (Security Score Index)
interface RadialProgressChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  title?: string;
  subtitle?: string;
}

export const RadialProgressChart: React.FC<RadialProgressChartProps> = ({
  percentage,
  size = 140,
  strokeWidth = 10,
  title = "Security Score",
  subtitle = "Maturity Grade"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Emerald green strictly for successful 100% state, otherwise brand blue
  const is100 = percentage === 100;
  const strokeColor = is100 ? '#10B981' : '#0000FE';

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-surface">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            className="text-zinc-800"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="square"
            stroke={strokeColor}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold font-mono text-white tracking-tight">
            {percentage}%
          </span>
          <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold mt-0.5">
            {subtitle}
          </span>
        </div>
      </div>
      {title && (
        <h4 className="text-zinc-300 font-semibold text-xs mt-3 text-center">{title}</h4>
      )}
    </div>
  );
};

// 2. Bar Chart (Vulnerability Severity Breakdown)
interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 140 }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="w-full flex flex-col justify-end" style={{ height: height + 30 }}>
      <div className="flex items-end justify-between h-full gap-5 px-1">
        {data.map((item, idx) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <span className="text-[10px] font-mono text-zinc-350 mb-1 font-bold">
                {item.value}
              </span>
              <div 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-sm relative overflow-hidden" 
                style={{ height: `${percentage}%`, minHeight: '6px' }}
              >
                <div 
                  className="absolute inset-0 w-full h-full bg-primary"
                />
              </div>
              <span className="text-[10px] font-medium text-zinc-450 mt-1.5 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. Area Chart (Engineering Maturity History)
interface AreaChartProps {
  labels: string[];
  points: number[];
  height?: number;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  labels,
  points,
  height = 140
}) => {
  const maxVal = Math.max(...points, 100);
  const minVal = Math.min(...points, 0);
  const range = maxVal - minVal;

  const paddingX = 35;
  const paddingY = 15;
  const width = 500;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const pointsString = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * chartWidth;
    const y = height - paddingY - ((p - minVal) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaString = `${paddingX},${height - paddingY} ${pointsString} ${width - paddingX},${height - paddingY}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="areaGradientRedesign" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0000FE" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0000FE" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Flat Grid lines */}
        {[0, 0.5, 1].map((ratio, idx) => {
          const y = paddingY + ratio * chartHeight;
          const val = Math.round(maxVal - ratio * range);
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#242424"
                strokeWidth="1"
              />
              <text
                x={paddingX - 6}
                y={y + 3}
                fill="#71717A"
                fontSize="9"
                fontFamily="JetBrains Mono"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Shaded Area */}
        <polygon points={areaString} fill="url(#areaGradientRedesign)" />

        {/* Polyline */}
        <polyline
          fill="none"
          stroke="#0000FE"
          strokeWidth="1.5"
          points={pointsString}
        />

        {/* Data points */}
        {points.map((p, idx) => {
          const x = paddingX + (idx / (points.length - 1)) * chartWidth;
          const y = height - paddingY - ((p - minVal) / range) * chartHeight;
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="3"
              fill="#FFFFFF"
              stroke="#0000FE"
              strokeWidth="1.5"
            />
          );
        })}

        {/* X Axis Labels */}
        {labels.map((l, idx) => {
          const x = paddingX + (idx / (labels.length - 1)) * chartWidth;
          return (
            <text
              key={idx}
              x={x}
              y={height - 2}
              fill="#71717A"
              fontSize="9"
              fontFamily="Inter"
              fontWeight="500"
              textAnchor="middle"
            >
              {l}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
