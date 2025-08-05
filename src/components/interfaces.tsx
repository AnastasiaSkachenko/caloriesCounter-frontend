 export interface Base {
  id: number,
  calories: number,
  protein: number,
  carbohydrate: number,
  fat: number
}

export interface BaseNew {
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

export interface Product extends BaseNew  {
  media?: (File | string)[],
  user: number,

}

export interface ProductInput {
  product: FormData,
}
export interface ProductEditInput {
  product: FormData,
  id?: number
}

export interface PopInput {
  id: number
}

 


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
  weight: number
}

export interface IngredientInput {
  ingredient: Ingredient
}
//not finished
export interface Dish extends BaseNew  {
  image: File | string,
  calories_100: number,
  protein_100: number,
  carbs_100: number,
  fat_100: number,
  caffeine_100: number,
  fiber_100: number,
  sugars_100: number

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
  favorite: boolean
}

export interface DishInput {
  dish: FormData,
}
export interface DishEditInput {
  dish: FormData,
  id: string
}

export interface DishFormProps { 
  onSuccess?: () => void,
  onSubmit?: (dish:Dish) => void,
  onSuccessEdit?: (modifiedDish: Dish) => void,
  onCancel?: () => void;  
  dishToEdit?: Dish;
  ingredientsData?: Ingredient[]
}


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
  image?: File | string,
  activity_level: number, 
  exp?: number;  
  gender: 'male' | 'female';
  goal: 'maintain' | 'gain' | 'lose' | 'active_lose' | 'active_gain',
  balance: number
}

export interface ModifyUser {
  calories_d: number;
  protein_d: number;
  carbohydrate_d: number;
  fat_d: number;
}

export type MacroNitrient = 'calories' | 'protein' | 'carbs' | 'fat' | 'sugars' | 'fiber' | 'caffeine' 

