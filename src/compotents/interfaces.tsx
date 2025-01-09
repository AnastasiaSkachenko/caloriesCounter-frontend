export interface Skill {
  name: string;
  image: string;
  experience: number;
}
  
export interface HorizontalCarouselProps {
  skills: Skill[];
  imageRoot: string;
}
  

export interface Project {
  name: string,
  description: string,
  tools: string[]
}


export interface ProjectFetched {
  name: string,
  description: string,
  tools: string
}


export interface Base {
  id: number,
  calories: number,
  protein: number,
  carbohydrate: number,
  fat: number
}



export interface Product extends Base {
  name: string,
  image: string,
}

export interface ProductInput {
  product: Product
}

export interface PopInput {
  id: number
}

 


export interface Ingredient extends Base {
  name: string,
  image: string,
  dish: number,
  product: number,
  weight: number
}

export interface IngredientInput {
  ingredient: Ingredient
}

export interface Dish extends Base {
  name: string,
  image: string,
  calories_100: number,
  protein_100: number,
  carbohydrate_100: number,
  fat_100: number,
  drink: boolean,
  weight: number,
  product?: number
}

export interface DishInput {
  dish: Dish,
}

export interface DiaryRecord extends Base {
  name: string,
  image: string,
  calories_100: number,
  protein_100: number,
  carbohydrate_100: number,
  fat_100: number,
  drink: boolean,
  weight: number,
  dish: Dish
};

export interface DiaryRecordInput {
  diaryRecord: DiaryRecord
}

