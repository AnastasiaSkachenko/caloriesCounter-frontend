import { PopInput, Product, ProductInput } from "../components/interfaces";
import Cookies from "universal-cookie"; 
import { axiosPublic } from "./axios";

const cookies = new Cookies();

export const logError = (error: unknown, functionName: string) => {
  if (import.meta.env.VITE_NODE_ENV === "development") {
    console.error(`Error in ${functionName}:`, error);
  }
};

// Products

export const fetchProducts = async ({ pageParam = 1, queryKey}: { pageParam?: number, queryKey: string[], }) => {
  try {
    const [, query] = queryKey; // Extract query from queryKey

    const params = new URLSearchParams();
    params.append("page", pageParam.toString());
    if (query) params.append("query", query);
    

    const response = await axiosPublic.get(`/products/?${params.toString()}`, {
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
        "Content-Type": "application/json",
      },
    });

    return { products: response.data.products, hasMore: response.data.has_more, currentPage: pageParam };
  } catch (error: unknown) {
    logError(error, "fetchProducts");
    return { error: "An error occurred while fetching products. Please try again later.", hasMore: false };
  }
};

export const getProductNames = async (): Promise<string[]> => {
  try {
    const response = await axiosPublic.get(`/products/names/`, {
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
      },
    });
    return response.data.products || [];
  } catch (error: unknown) {
    logError(error, "getProductNames");
    return ["Failed to load product names. Please try again."];
  }
};
 

export const saveProduct = async ({ product }: ProductInput): Promise<Product | string> => {
  try {
    const response = await axiosPublic.post(`/products/`, product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: unknown) {
    logError(error, "saveProduct");
    return "Failed to save the product. Please try again.";
  }
};

export const editProduct = async ({ product, id }: {product: FormData, id: string}): Promise<void | string> => {
  try {
    await axiosPublic.put(`/products/?id=${id}`, product);
  } catch (error: unknown) {
    logError(error, "editProduct");
    return "An error occurred while updating the product. Please try again.";
  }
};

export const deleteProduct = async ({ id }: PopInput): Promise<string | void> => {
  try {
    const response = await axiosPublic.delete(`/products/?id=${id}`, {
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
        "Content-Type": "application/json",
      },
    });

    if (response.data.error) {
      return response.data.message;
    }
  } catch (error: unknown) {
    logError(error, "deleteProduct");
    return "Failed to delete the product. Please try again.";
  }
};
