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
  dishNames: string[];
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

