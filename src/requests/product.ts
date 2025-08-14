import { Product } from "../components/interfaces";
import { axiosPublic } from "../utils/axios";



export const fetchProducts = async ({ pageParam = 1, queryKey}: { pageParam?: number, queryKey: string[], }): Promise<{
    products: Product[];
    hasMore: boolean;
    currentPage: number;
    error?: undefined;
} | {
    error: string;
    hasMore: boolean;
    products?: undefined;
    currentPage?: undefined;
}> => {
  try {
    const [, query] = queryKey; // Extract query from queryKey

    const params = new URLSearchParams();
    params.append("page", pageParam.toString());
    if (query) params.append("query", query);

    const response = await axiosPublic.get(`/products/?${params.toString()}`);

    return { products: response.data.products, hasMore: response.data.has_more, currentPage: pageParam };
  } catch {
    return { error: "An error occurred while fetching products. Please try again later.", hasMore: false };
  }
};

export const getProductNames = async (): Promise<string[]> => {
  try {
    const response = await axiosPublic.get(`/products/names/`);
    return response.data.products || [];
  } catch {
    return ["Failed to load product names. Please try again."];
  }
};
 

export const saveProduct = async ({ product }: { product: FormData }): Promise<Product | string> => {
  try {
    const response = await axiosPublic.post(`/products/`, product);
    return response.data;
  } catch {
    return "Failed to save the product. Please try again.";
  }
};


export const editProduct = async ({ product, id }: { product: FormData, id: string }): Promise<void | string> => {
  try {
    await axiosPublic.put(`/products/?id=${id}`, product);
  } catch {
    return "An error occurred while updating the product. Please try again.";
  }
};


export const deleteProduct = async ({ id }: {id: string}): Promise<string | void> => {
  try {
    const response = await axiosPublic.delete(`/products/?id=${id}`);

    if (response.data.error) {
      return response.data.message;
    }
  } catch {
    return "Failed to delete the product. Please try again.";
  }
};
