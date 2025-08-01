import { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { DiaryRecord, User } from "../interfaces";

interface NutritionProgressProps {
  user: User;
  filteredRecords: DiaryRecord[];
}

const NutritionProgress: React.FC<NutritionProgressProps> = ({ user, filteredRecords }) => {
  const [chartSize, setChartSize] = useState(120); // Default chart size
  const [itemsPerRow, setItemsPerRow] = useState(4); // Default to 4 items in a row

  // Adjust chart size & items per row based on screen width
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;

      if (width < 400) {
        setChartSize(70);
        setItemsPerRow(2);
      } else if (width < 768) {
        setChartSize(100);
        setItemsPerRow(2);
      } else if (width < 1024) {
        setChartSize(120);
        setItemsPerRow(4);
      } else if (width < 1200) {
        setChartSize(130);
        setItemsPerRow(4);
      } else {
        setChartSize(150);
        setItemsPerRow(4);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  console.log(filteredRecords)

  const totalCalories = Math.round(filteredRecords?.reduce((acc, record) => acc + record.calories, 0) || 0);
  const totalProtein = Math.round(filteredRecords?.reduce((acc, record) => acc + (record.protein ? Number(record.protein) : 0), 0) || 0);
  const totalCarbs = Math.round(filteredRecords?.reduce((acc, record) => acc + (record.carbs ? Number(record.carbs) : 0), 0));
  const totalFats = Math.round(filteredRecords?.reduce((acc, record) => acc + (record.fat ? Number(record.fat) : 0), 0));
  
   
  const goalCalories = user.calories_d || 1;
  const goalProtein = user.protein_d || 1;
  const goalCarbs = user.carbs_d || 1;
  const goalFats = user.fat_d || 1;

  const calculateColor = (percentage: number) => {
    if (percentage > 120 || percentage < 80) return "#FF4500"; // More than 20% over goal → Red
    if (percentage >= 80 && percentage <= 120) return "#FFD700"; // 5-20% to goal → Yellow
    return "#32CD32"; // Less than 5% to goal → Green
  };

  const data = [
    { name: "Calories", value: (totalCalories / goalCalories) * 100, color: calculateColor((totalCalories / goalCalories) * 100), total: totalCalories, goal: goalCalories },
    { name: "Protein", value: (totalProtein / goalProtein) * 100, color: calculateColor((totalProtein / goalProtein) * 100), total: totalProtein, goal: goalProtein },
    { name: "Carbs", value: (totalCarbs / goalCarbs) * 100, color: calculateColor((totalCarbs / goalCarbs) * 100), total: totalCarbs, goal: goalCarbs },
    { name: "Fats", value: (totalFats / goalFats) * 100, color: calculateColor((totalFats / goalFats) * 100), total: totalFats, goal: goalFats },
  ];

  return (
    <div className="d-flex flex-wrap justify-content-center gap-4 w-100">
      {data.map((item, index) => (
        <div
          key={index}
          className="d-flex flex-column align-items-center text-center"
          style={{ 
            minWidth: "100px", 
            flex: `0 0 calc(${100 / itemsPerRow}% - 10px)`, // Ensures 4 or 2 items per row
            maxWidth: "200px" 
          }}
        >
          <RadialBarChart
            width={chartSize}
            height={chartSize}
            cx={chartSize / 2}
            cy={chartSize / 2}
            innerRadius={chartSize * 0.25}
            outerRadius={chartSize * 0.4}
            barSize={chartSize * 0.1}
            data={[item]}
          >
            <PolarAngleAxis 
              type="number" 
              domain={[0, 100]} 
              angleAxisId={0} 
              tick={false} 
            />
            <RadialBar 
              dataKey="value" 
              cornerRadius={chartSize * 0.08} 
              fill={item.color} 
            />
            <text 
              x={chartSize / 2} 
              y={chartSize / 2} 
              textAnchor="middle" 
              dominantBaseline="central" 
              fontSize={chartSize * 0.12} 
              fontWeight="bold" 
              fill={item.color}
            >
              {item.value.toFixed(0)}%
            </text>
          </RadialBarChart>
          <p className="mb-1">{item.name}: {item.total}</p>
          <p className="mb-0">Goal: {item.goal}</p>
        </div>
      ))}
    </div>
  );
};

export default NutritionProgress;
