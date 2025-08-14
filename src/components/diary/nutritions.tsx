import { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { Goal, User } from "../interfaces";
import { useActivity } from "../../requests/activity";
import { useQuery } from "@tanstack/react-query";
import { fetchDailyGoal } from "../../requests/diary";
import { NutritionProgressProps } from "../props";


const NutritionProgress: React.FC<NutritionProgressProps> = ({ user, filteredRecords, date }) => {
  const [chartSize, setChartSize] = useState(120); // Default chart size
  const [itemsPerRow, setItemsPerRow] = useState(4); // Default to 4 items in a row

  const [goal, setGoal] = useState<Goal | null>(null);

  useEffect(() => {
    const getCurrentGoal = async () => {
      const currentGoal = await fetchDailyGoal(date);
      setGoal(currentGoal);
    };

    getCurrentGoal();
  }, [date]);

  const { fetchActivityRecords } = useActivity()

  function getFallback(user: User, calories: number) {

    const weight = user.weight ?? 70;

    const protein = Math.round(weight * (1.6));
    const proteinCalories = protein * 4;

    const fatCalories = calories * (0.25);
    const fats = Math.round(fatCalories / 9);

    const remainingCalories = Math.max(calories - (proteinCalories + fatCalories), 0);
    const carbs = Math.round(remainingCalories / 4);

    return {
      calories,
      protein,
      fats,
      carbs,
      sugars: Math.round((calories * 0.10) / 4),
      fiber: Math.round((calories / 1000) * 14),
      caffeine: user?.caffeine_d ?? 400
    };
  }

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

  const {
    data: activities
  } = useQuery({
    queryKey: ['activityRecords', date], 
    queryFn: () =>  fetchActivityRecords(date), 
  });

  const calories = user.calculate_nutritions_from_activity_level 
    ? user.calories_d 
    : (user.bmr ?? 0) + (
      activities?.reduce((acc, record) => acc + (record.calories_burned ?? 0), 0) ?? 0
  );  

  const fallback = getFallback(user, calories)

  const goalCalories = goal?.calories_intake_goal ?? fallback.calories ?? 1;
  const goalProtein = goal?.protein_goal ?? fallback.protein ?? 1;
  const goalCarbs = goal?.carbs_goal ?? fallback.carbs ?? 1;
  const goalFats = goal?.fat_goal ?? fallback.fats ?? 1;
  const goalFiber = goal?.fiber_goal ?? fallback.fiber ?? 1
  const goalSugars = goal?.sugars_goal ?? fallback.sugars ?? 1
  const goalCaffeine = goal?.caffeine_goal ?? fallback.caffeine ?? 1

  const totalCalories = Math.round(filteredRecords?.reduce((acc, record) => acc + record.calories, 0) || 0);
  const totalProtein = Math.round(filteredRecords?.reduce((acc, record) => acc + (record.protein ? Number(record.protein) : 0), 0) || 0);
  const totalCarbs = Math.round(filteredRecords?.reduce((acc, record) => acc + (record.carbs ? Number(record.carbs) : 0), 0));
  const totalFats = Math.round(filteredRecords?.reduce((acc, record) => acc + (record.fat ? Number(record.fat) : 0), 0));
  const totalFiber = Math.round(filteredRecords?.reduce((acc, record) => acc + (record.fiber ? Number(record.fiber) : 0), 0));
  const totalSugars = Math.round(filteredRecords?.reduce((acc, record) => acc + (record.sugars ? Number(record.sugars) : 0), 0));
  const totalCaffeine = Math.round(filteredRecords?.reduce((acc, record) => acc + (record.caffeine ? Number(record.caffeine) : 0), 0));

  
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
    { name: "Fiber", value: (totalFiber / goalFiber) * 100, color: calculateColor((totalFiber / goalFiber) * 100), total: totalFiber, goal: goalFiber },
    { name: "Sugars", value: (totalSugars / goalSugars) * 100, color: calculateColor((totalSugars / goalSugars) * 100), total: totalSugars, goal: goalSugars },
    { name: "Caffeine", value: (totalCaffeine / goalCaffeine) * 100, color: calculateColor((totalCaffeine / goalCaffeine) * 100), total: totalCaffeine, goal: goalCaffeine },
  ];

  return (
    <div className="d-flex flex-wrap justify-content-center gap-4 w-100 ">
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
