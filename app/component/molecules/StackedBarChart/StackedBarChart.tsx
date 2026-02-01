import React from 'react';

type ReportItem = {
  category: string;
  budget: number;
  spent: number;
};

interface BudgetChartProps {
  data: ReportItem[];
  width?: number;
  height?: number;
  barHeight?: number;
  gap?: number;
}

const HorizontalBudgetChart: React.FC<BudgetChartProps> = ({
  data,
  width = 350,
  height = 300,
  barHeight = 25,
  gap = 25,
}) => {
  const maxValue = Math.max(...data.map((d) => Math.max(d.budget, d.spent)));

  return (
    <svg width={width} height={height} style={{ border: '1px solid #ccc' }}>
      {/* X-axis */}
      <line
        x1={80}
        y1={height - 30}
        x2={width - 10}
        y2={height - 30}
        stroke="black"
      />

      {/* Y-axis */}
      <line x1={80} y1={20} x2={80} y2={height - 30} stroke="black" />

      {data.map((item, index) => {
        const y = 40 + index * (barHeight + gap);
        const budgetWidth = (item.budget / maxValue) * (width - 120);
        const spentWidth = (item.spent / maxValue) * (width - 120);

        return (
          <g key={item.category}>
            {/* Budget (blue) */}
            <rect
              x={80}
              y={y}
              width={budgetWidth}
              height={barHeight}
              fill="steelblue"
              rx={4}
            />

            {/* Spent (green if within budget, red excess if exceeded) */}
            {item.spent <= item.budget ? (
              <rect
                x={80}
                y={y}
                width={spentWidth}
                height={barHeight}
                fill="green"
                rx={4}
              />
            ) : (
              <>
                {/* Green part (budget consumed) */}
                <rect
                  x={80}
                  y={y}
                  width={budgetWidth}
                  height={barHeight}
                  fill="green"
                  rx={4}
                />
                {/* Red excess */}
                <rect
                  x={80 + budgetWidth}
                  y={y}
                  width={spentWidth - budgetWidth}
                  height={barHeight}
                  fill="red"
                  rx={4}
                />
              </>
            )}

            {/* Category label (on the left) */}
            <text
              x={70}
              y={y + barHeight / 2}
              fontSize={12}
              textAnchor="end"
              alignmentBaseline="middle"
            >
              {item.category}
            </text>

            {/* Amount label (at the end of spent bar) */}
            <text
              x={80 + Math.max(spentWidth, budgetWidth) + 5}
              y={y + barHeight / 2}
              fontSize={10}
              alignmentBaseline="middle"
              fill="#333"
            >
              {item.spent}/{item.budget}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default HorizontalBudgetChart;
