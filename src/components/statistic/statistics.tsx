import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useStatisticsRequests } from "../../requests/statistics";
import {  Nutrient, Suggestion, SuggestionDish } from "../interfaces";
import MacroNutrientChart from "./MacroNutrient";
import Header from "../general/header";
import { labelKeyNutriment } from "../../assets/constants/nutritions";


const StatisticsPage: React.FC = () => {
  const { getStatistics } = useStatisticsRequests();
  const [month] = useState(new Date().getMonth());
  const [year] = useState(new Date().getFullYear());

  const {
    status: statusStatistics,
    error: errorStatistics,
    isLoading: isLoadingStatistics,
    data: statistics,
  } = useQuery({
    queryKey: ["statistics", month, year],
    queryFn: () => getStatistics({ month, year }),
  });

  const nutrients: Nutrient[] = [
    "calories_intake",
    "protein",
    "carbs",
    "fat",
    "fiber",
    "sugars",
    "caffeine",
  ];

  if (isLoadingStatistics) return <p>Loading...</p>;
  if (statusStatistics === "error")
    return <p>{JSON.stringify(errorStatistics)}</p>;

  return (
    <div className="bg-dark min-h-screen p-3">
      <Header active="statistics" />

      <h3 className="text-white">Statistics</h3>

      <div className="p-3 mb-5 bg-white/20 rounded-md">
        <h5 className="text-xl text-white font-semibold">
          Information to consider following month:
        </h5>
        {statistics?.suggested_dishes.map((suggestion: Suggestion, index: number) => (
          <div key={index}>
            <p className="text-danger-light text-lg  my-2">
              {suggestion.message}
            </p>
            {suggestion.dishes.map((dish: SuggestionDish, dishIndex: number) => (
              <div key={dishIndex} className="my-1">
                <Link
                  to={`/dish/${dish.type}/${dish.id}`}
                  className="text-white underline"
                >
                  {dish.name}
                </Link>
                <span className="text-white"> - </span>
                {labelKeyNutriment.map((nutrient) =>
                  dish[nutrient.key as keyof typeof dish] != null ? (
                    <span className="text-white mr-2" key={nutrient.key}>
                      {nutrient.label}: {dish[nutrient.key as keyof typeof dish]}
                    </span>
                  ) : null
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {nutrients.map((nutrient: Nutrient, index) => {
        const upperCase = nutrient.charAt(0).toUpperCase() + nutrient.slice(1);
        const title = upperCase.includes("_")
          ? upperCase.split("_")[0]
          : upperCase;

        return (
          <div key={index} className="p-3 mb-5 bg-white/20 rounded-md">
            <h3 className="text-lg font-semibold text-white">
              {title}: Intake vs Goal
            </h3>
            <MacroNutrientChart
              data={statistics?.goals ?? []}
              nutrient={nutrient}
            />
            {nutrient != "caffeine" && (
              <p className="text-white my-4">
                Feedback: {statistics?.feedback?.[nutrient]}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsPage;
