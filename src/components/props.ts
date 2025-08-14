import { Product } from "./interfaces";

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


