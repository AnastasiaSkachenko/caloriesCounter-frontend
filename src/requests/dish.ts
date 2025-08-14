import {  Dish } from "../components/interfaces";
import { axiosPrivate, axiosPublic } from "../utils/axios";



export const fetchDishes = async ({ pageParam = 1, query = "", onlyNoProduct = false, filterKey = ['all'] }) => {
  const response = await axiosPrivate.get("/dishes/", {
      params: {
          page: pageParam,
          query: query,
          only_no_product: onlyNoProduct,
          filter: filterKey
      },
  });
  return response.data;
};


export const getDishNames = async (): Promise<string[]> => {
  const response = await axiosPublic.get(`dishes/names/`);

  const data = await response.data
  return  data.dishes || []
}


export const IsNameUnique = async (name: string, editingName?: string) => {
  try {
    const response = await axiosPublic.get(`/isNameUnique/`, {params: { name, editingName },});
      return {
      unique: !response.data.exists_product && !response.data.exists_dish,
      message: response.data.exists_product
        ? 'Product with this name already exists.'
        : response.data.exists_dish
        ? 'Dish with this name already exists.'
        : undefined
    };
  } catch {
    return { unique: false, message: 'Error checking name uniqueness.' };
  }
};


export const fetchDish = async (id:string)  => { 
  const response = await axiosPublic.get(`/get-dish-by-id/${id}`);

  const data = await response.data
  const dish:Dish = data
  return dish
};

  
export const saveDish = async ({dish}: {dish: FormData}): Promise<string> => {
  const response = await axiosPublic.post(`dishes/`, dish);

  const data = await response.data
  return  data.id
}

  
export const editDish = async ({dish, id}: {dish: FormData, id: string}): Promise<void> => {
  await axiosPublic.put(`dishes/?id=${id}`, dish, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}
  
export const deleteDish = async ({id}: {id: string}): Promise<string | void> => {
  const response = await axiosPublic.delete(`dishes/?id=${id}`);

  if (response.data.error) {
    const errorData = await response.data.error  
    return errorData.message;  
  }
}

export const toggleFavorite = async (dishId: string) => {  
  const response = await axiosPrivate.patch(`dish/${dishId}/favorite/`)
  return response.data.favorite;
};