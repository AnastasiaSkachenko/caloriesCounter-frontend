 export interface Base {
  id: number,
  calories: number,
  protein: number,
  carbohydrate: number,
  fat: number
}

export interface Product extends Base {
  name: string,
  image?: File | string,
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

 


export interface Ingredient extends Base {
  name: string,
  dish: number,
  product: number,
  weight: number
}

export interface IngredientInput {
  ingredient: Ingredient
}

export interface Dish extends Base {
  name: string,
  image: File | string,
  calories_100: number,
  protein_100: number,
  carbohydrate_100: number,
  fat_100: number,
  drink: boolean,
  weight: number,
  product?: number,
  portion:number,
  portions: number,
  type: 'pre_made' | 'custom'
  ingredients?: Ingredient[]
  description: string
}

export interface DishInput {
  dish: FormData,
}
export interface DishEditInput {
  dish: FormData,
  id: number
}

export interface DishFormProps { 
  onSuccess?: () => void,
  onSubmit?: (dish:Dish) => void,
  onSuccessEdit?: (modifiedDish: Dish) => void,
  onCancel?: () => void;  
  dishToEdit?: Dish;
  ingredientsData?: Ingredient[]
}


export interface DiaryRecord extends Base {
  name: string,
  image: string,
  weight?: number,
  dish: number,
  date: string,
  portions?: number
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
  carbohydrate_d: number;
  fat_d: number;
  image?: File | string,
  activity_level: number, 
  exp?: number;  
  gender: 'male' | 'female';
  goal: 'maintain' | 'gain' | 'lose' | 'active_lose' | 'active_gain'
}

export interface ModifyUser {
  calories_d: number;
  protein_d: number;
  carbohydrate_d: number;
  fat_d: number;
}
