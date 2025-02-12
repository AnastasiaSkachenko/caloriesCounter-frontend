import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { DiaryRecord, User } from "./interfaces";

interface NutritionProgressProps {
  user: User;
  filteredRecords: DiaryRecord[];
}

const NutritionProgress: React.FC<NutritionProgressProps> = ({ user, filteredRecords }) => {
  const totalCalories = filteredRecords?.reduce((acc, record) => acc + record.calories, 0) || 0;
  const totalProtein = filteredRecords?.reduce((acc, record) => acc + record.protein, 0) || 0;
  const totalCarbs = filteredRecords?.reduce((acc, record) => acc + record.carbohydrate, 0) || 0;
  const totalFats = filteredRecords?.reduce((acc, record) => acc + record.fat, 0) || 0;

  const goalCalories = user.calories_d || 1;
  const goalProtein = user.protein_d || 1;
  const goalCarbs = user.carbohydrate_d || 1;
  const goalFats = user.fat_d || 1;

  const calculateColor = (percentage: number) => {
    if (percentage > 120 || percentage < 80) return "#FF4500"; // More than 20% over goal → Red
    if (percentage >= 80 && percentage <= 120) return "#FFD700"; // 5-20% to goal → Yellow
    return "#32CD32"; // Less than 5% to goal → Green
  };
//(totalCalories / goalCalories) * 100

  const data = [
    { name: "Calories", value: (totalCalories / goalCalories) * 100, color: calculateColor((totalCalories / goalCalories) * 100), total:totalCalories, goal: goalCalories },
    { name: "Protein", value: (totalProtein / goalProtein) * 100, color: calculateColor((totalProtein / goalProtein) * 100), total:totalProtein, goal: goalProtein },
    { name: "Carbs", value: (totalCarbs / goalCarbs) * 100, color: calculateColor((totalCarbs / goalCarbs) * 100), total: totalCarbs, goal: goalCarbs },
    { name: "Fats", value: (totalFats / goalFats) * 100, color: calculateColor((totalFats / goalFats) * 100), total:totalFats, goal:goalFats },
  ];

  console.log(data)


  return (
    <div className="d-flex justify-content-around">
      {data.map((item, index) => (
        <div 
          key={index} 
          className="d-flex flex-column align-items-center text-center"
        >
          <RadialBarChart
            width={120}
            height={120}
            cx={60}
            cy={60}
            innerRadius={30}
            outerRadius={50}
            barSize={10}
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
              cornerRadius={10} 
              fill={item.color} 
            />
            {/* Centered text inside the circle */}
            <text 
              x={60} 
              y={60} 
              textAnchor="middle" 
              dominantBaseline="central" 
              fontSize="14" 
              fontWeight="bold" 
              fill={item.color}
            >
              {item.value.toFixed(0)}%
            </text>
          </RadialBarChart>
          <p className="mb-1">Consumed {item.name}: {item.total}</p>
          <p className="mb-0">Goal: {item.goal}</p>
        </div>

      ))}
    </div>
  );
};

export default NutritionProgress;
