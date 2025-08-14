import { ActivityRecordPayload, DiaryRecord, Dish, Ingredient, Product, User } from "./interfaces";

// ################## ################## ################## ################## ################## general
export interface MediaScrollerProps {
  media?: (File | string)[];
  name: string;
  className?: string;
  width: number;
  height: number;
  bg: string
}





// ################## ################## ################## ################## ################## products

export interface ProductFormProps {
  onSubmitSuccess?: (product: Product) => void;
  onCancel?: () => void;  
  onError?: (errorMessage: string) => void;
  product?: Product,
  productName?: string,
}

export interface ProductCardProps {
  setEditProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  currentUser: number;
  product: Product
}

export interface ProductGridProps {
  searchQuery: string;
  setEditProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  currentUser: number;
}


// ################## ################## ################## ################## ################## products

//main dishes page
export interface DishProps {
  dish: Dish;
  setEditDish: (dish: Dish) => void;
}

export interface DishGridProps {
  query: string,
  setEditDish: (dish: Dish) => void,
  filter: string[]
}

export interface DishFormProps { 
  onSuccess?: () => void,
  onSubmit?: (dish:Dish) => void,
  onSuccessEdit?: (modifiedDish: Dish) => void,
  onCancel?: () => void;  
  dishToEdit?: Dish;
  ingredientsData?: Ingredient[]
}


// ################## ################## ################## ################## ################## diary

export interface NutritionProgressProps {
  user: User;
  filteredRecords: DiaryRecord[];
  date: string,
}

export interface  RecordComponentProps {
  record: DiaryRecord,
  editRecord: (record: DiaryRecord) => void,
}

export interface RecordFormProps {
  onSuccess?: () => void
  onCancel?: () => void,
  recordData?: DiaryRecord,
}


// ################## ################## ################## ################## ################## diary
export interface ActivityRecordComponentProps {
  record: ActivityRecordPayload;
  editRecord: () => void;
}