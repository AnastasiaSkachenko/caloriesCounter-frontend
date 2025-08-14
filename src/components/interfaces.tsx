 export interface BaseOLd {
  id: number,
  calories: number,
  protein: number,
  carbohydrate: number,
  fat: number
}

export interface Base {
  id: string,
  name: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  caffeine: number,
  fiber: number,
  sugars: number
}

export type MacroNutrient = 'calories' | 'protein' | 'carbs' | 'fat' | 'sugars' | 'fiber' | 'caffeine' 
export type MacroNutrientUser = 'calories_d' | 'protein_d' | 'carbs_d' | 'fat_d' | 'sugars_d' | 'fiber_d' | 'caffeine_d' 
export type MacroNutrientDish100 =  'calories_100' | 'protein_100' | 'carbs_100' | 'fat_100' | 'sugars_100' | 'fiber_100' | 'caffeine_100' 


//                                                                                                                      Product
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
export interface Product extends Base  {
  media?: (File | string)[],
  user: number,
  media_to_delete?: string[]

}

export interface ProductInput {
  product: FormData,
}

export interface ProductEditInput {
  product: FormData,
  id?: number
}


//                                                                                                                      Ingredient
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export interface Ingredient {
  id: string,
  name: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  caffeine: number,
  fiber: number,
  sugars: number
  dish: string,
  product: string,
  weight: number,
  edited?: boolean
}

export interface IngredientInput {
  ingredient: Ingredient
}


//                                                                                                                      Dish
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
export interface Dish extends Base  {
  media?: (File | string)[],
  calories_100: number,
  protein_100: number,
  carbs_100: number,
  fat_100: number,
  caffeine_100: number,
  fiber_100: number,
  sugars_100: number,
  drink: boolean,
  weight: number,
  product?: number,
  portion:number,
  portions: number,
  type: 'pre_made' | 'custom'
  ingredients?: Ingredient[]
  description: string,
  user: number,
  weight_of_ready_product?: number,
  favorite: boolean,
  media_to_delete?: string[]
}

export interface DishInput {
  dish: FormData,
}
export interface DishEditInput {
  dish: FormData,
  id: string,
}

//                                                                                                                      Diary Record
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
export interface DiaryRecord  {
  id: string,
  name: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  caffeine: number,
  fiber: number,
  sugars: number,
  image: string,
  weight?: number,
  dish: string,
  date: string,
  portions?: number,
  user: number
};

export interface DiaryRecordInput {
  diaryRecord: DiaryRecord
}

//                                                                                                                      User
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  calories_d: number;
  protein_d: number;
  carbs_d: number;
  fat_d: number;
  sugars_d: number,
  fiber_d: number,
  caffeine_d: number,
  media?: (File | string)[],
  activity_level: number, 
  exp?: number;  
  gender: 'male' | 'female';
  goal: 'maintain' | 'gain' | 'lose' | 'active_lose' | 'active_gain',
  balance: number,
  image?: string | File,
  calculate_nutritions_from_activity_level?: boolean,
  bmr?: number
}

export interface ModifyUser {
  calories_d: number;
  protein_d: number;
  carbs_d: number;
  fat_d: number;
  sugars_d: number,
  fiber_d: number,
  caffeine_d: number,
}


//                                                                                                                      Activities
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

type ActivitySpecificFields = {
  walk_time: { duration_minutes: number };
  walk_steps: { steps: number };
  run: { duration_minutes: number; distance_km?: number };
  interval_run: { duration_minutes: number };
  workout: { duration_minutes: number; name?: string; description?: string };
  tabata: { duration_minutes: number; name?: string; description?: string };
  volleyball: { duration_minutes: number };
  custom: { duration_minutes: number; met?: number };
  jumping: { duration_minutes: number };
  stretching: { duration_minutes: number };
  home_chores: { duration_minutes: number };
  work_bk: { duration_minutes: number };
};


type BaseActivityFields = Omit<BaseActivityRecord, 'activity_type'>;

export type ActivityRecordPayload = {
  [K in keyof ActivitySpecificFields]: BaseActivityFields & {
    activity_type: K;
  } & ActivitySpecificFields[K];
}[keyof ActivitySpecificFields];


export type ActivityType =
  | 'workout'
  | 'tabata'
  | 'run'
  | 'walk_time'
  | 'walk_steps'
  | 'interval_run'
  | 'custom'
  | 'volleyball'  
  | 'jumping'
  | 'stretching' 
  | 'home_chores'
  | "work_bk" ;

export interface BaseActivityRecord {
  id: string,
  activity_type: ActivityType;
  weight_kg: number;
  duration_minutes: number;
  intensity: number; // scale 1–5
  timestamp: string;
  calories_burned?: number,
  done: boolean,
  user: number,
  description?: string
}



export type Values = Omit<BaseActivityFields, 'user'> & {
  activity_type: ActivityType;
  timestamp: string; // Assuming frontend date object
  steps?: number;
  distance_km?: number;
  name?: string;
  description?: string;
};

export function buildActivityPayload(values: Values, userWeight: number, userId: number): ActivityRecordPayload {
  const base = {
    id: values.id.toString(),
    activity_type: values.activity_type,
    weight_kg: userWeight,
    intensity: values.intensity,
    calories_burned: 0,
    user: userId,
    done: values.done,
    timestamp: values.timestamp,
    description: values.description
  };

  switch (values.activity_type) {
    case 'walk_time':
      return {
        ...base,
        activity_type: 'walk_time',
        duration_minutes: values.duration_minutes,
      };

    case 'walk_steps':
      return {
        ...base,
        activity_type: 'walk_steps',
        steps: values.steps ?? 0,
        duration_minutes: 0
      };

    case 'run':
      return {
        ...base,
        activity_type: 'run',
        duration_minutes: values.duration_minutes,
        distance_km: values.distance_km,
      };

    case 'interval_run':
      return {
        ...base,
        activity_type: 'interval_run',
        duration_minutes: values.duration_minutes,
      };

    case 'workout':
      return {
        ...base,
        activity_type: 'workout',
        duration_minutes: values.duration_minutes,
        name: values.name,
        description: values.description,
      };

    case 'tabata':
      return {
        ...base,
        activity_type: 'tabata',
        duration_minutes: values.duration_minutes,
        name: values.name,
        description: values.description,
      };

    case 'volleyball':
      return {
        ...base,
        activity_type: 'volleyball',
        duration_minutes: values.duration_minutes,
      };

    case 'custom':
      return {
        ...base,
        activity_type: 'custom',
        duration_minutes: values.duration_minutes,
      };

    case 'jumping':
      return {
        ...base,
        activity_type: 'jumping',
        duration_minutes: values.duration_minutes,
      };

    case 'stretching':
      return {
        ...base,
        activity_type: 'stretching',
        duration_minutes: values.duration_minutes,
      };

    case 'home_chores':
      return {
        ...base,
        activity_type: 'home_chores',
        duration_minutes: values.duration_minutes,
      };

    case 'work_bk':
      return {
        ...base,
        activity_type: 'work_bk',
        duration_minutes: values.duration_minutes,
      };

    default:
      throw new Error('Unsupported activity type');
  }
}


//                                                                                                                      Goal
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
export interface Goal {
  id?: string;
  date: string,
  name: string;
  calories_intake: number,
  calories_intake_goal: number,
  protein_goal: number;
  carbs_goal: number;
  fat_goal: number; 
  fiber_goal: number;
  sugars_goal: number;
  caffeine_goal: number;
  calories: number;
  protein: number;
  carbs: number;
  fiber: number;
  fat: number;
  sugars: number;
  caffeine: number;
  calories_burned: number,
  calories_burned_goal: number
}

//                                                                                                                      Statistics
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


export type Nutrient = 'calories_intake' | 'protein' | 'carbs' | 'fat' | 'sugars' | 'fiber' | 'caffeine'

export type Feedback = Record<Nutrient, string>;

export interface Suggestion {
  message: string;
  dishes: SuggestionDish[]
}

export interface SuggestionDish {
  name: string;
  id: string;
  type: "custom" | "pre_made";
  fat?: number;
  carbs?: number;
  protein?: number;
  fiber?: number;
  sugar?: number;
  caffeine?: number;
}