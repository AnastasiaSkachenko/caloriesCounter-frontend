import { MacroNutrient, MacroNutrientDish100, MacroNutrientUser } from "../../components/interfaces";

export const nutritionsProduct: { title: string; value: MacroNutrient }[] = [
  {title: "Calories", value: "calories"},
  {title: "Protein", value: "protein"},
  {title: "Carbs", value: "carbs"},
  {title: "Fat", value: "fat"},
  {title: "Fiber", value: "fiber"},
  {title: "Sugars", value: "sugars"},
  {title: "Caffeine", value: "caffeine"}
]

export const nutritionsDish: { title: string; value: MacroNutrientDish100 }[] = [
  {title: "Calories", value: "calories_100"},
  {title: "Protein", value: "protein_100"},
  {title: "Carbs", value: "carbs_100"},
  {title: "Fat", value: "fat_100"},
  {title: "Fiber", value: "fiber_100"},
  {title: "Sugars", value: "sugars_100"},
  {title: "Caffeine", value: "caffeine_100"}
]

export const nutritionsUser: { title: string; value: MacroNutrientUser }[] = [
  {title: "Calories", value: "calories_d"},
  {title: "Protein", value: "protein_d"},
  {title: "Carbs", value: "carbs_d"},
  {title: "Fat", value: "fat_d"},
  {title: "Fiber", value: "fiber_d"},
  {title: "Sugars", value: "sugars_d"},
  {title: "Caffeine", value: "caffeine_d"}
]

export const labelKeyNutriment = [
  { key: "protein", label: "Protein" },
  { key: "fat", label: "Fat" },
  { key: "carbs", label: "Carbs" },
  { key: "fiber", label: "Fiber" },
  { key: "sugars", label: "Sugar" },
  { key: "caffeine", label: "Caffeine" },
];

