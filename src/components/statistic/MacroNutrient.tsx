import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Goal, Nutrient } from '../interfaces';

interface MacronutrientChartProps {
  data: Goal[];
  nutrient: Nutrient;
}

const MacronutrientChart: React.FC<MacronutrientChartProps> = ({ data, nutrient }) => {
  // Transform data for recharts
  const chartData = data.map(item => ({
    day: new Date(item.date).getDate().toString(),
    actual: item[nutrient] ?? 0,
    goal: item[`${nutrient}_goal`] ?? 0,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="rgba(134, 65, 244, 0.8)"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Actual"
          />
          <Line
            type="monotone"
            dataKey="goal"
            stroke="rgba(34, 128, 176, 0.8)"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Goal"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacronutrientChart;
