import { PopInput, Product, ProductEditInput, ProductInput } from "../components/interfaces";
import Cookies from "universal-cookie"; 
import { axiosPublic } from "./axios";

const cookies = new Cookies();


//                                                                                                                                   Products

export const fetchProducts = async ({ pageParam = 1, queryKey }: { pageParam?: number, queryKey: string[] }) => {
  const [, query] = queryKey; // Extract query from queryKey

  const params = new URLSearchParams();
  params.append("page", pageParam.toString());
  params.append("fetch_open_source", 'true')
  if (query) params.append("query", query);

  const response = await axiosPublic.get(`/products/?${params.toString()}`, {
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
      "Content-Type": "application/json",
    },
  })


 
 
  const data = await response.data
  return { products: data.products, hasMore: data.has_more, currentPage: pageParam };
};

export const getProductNames = async (): Promise<string[]> => {
  const response = await axiosPublic.get(`/products/names/`, {
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
  })
  return  response.data.products || []

}

export const checkProductExists = async (name: string) => {
  if (!name) return null;

  const response = await axiosPublic.get(`/checkProductName/`, {
    params: { name },
  });

  return response.data.exists;
};



export const saveProduct = async ({product}: ProductInput): Promise<Product> => {
  const response = await axiosPublic.post(`/products/`, product,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return  response.data
}

 
export const editProduct = async ({product, id}: ProductEditInput): Promise<void> => {
  await axiosPublic.put(`/products/?id=${id}`, {
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    body:product,
  })
}
 
export const deleteProduct = async ({id}: PopInput): Promise<string | void> => {
  const response = await axiosPublic.delete(`/products/?id=${id}`, {
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
      "Content-Type": "application/json",
    },
  })


  if (response.data.error) {
    const errorData = await response.data;  
    return errorData.message;  
  }
}

 