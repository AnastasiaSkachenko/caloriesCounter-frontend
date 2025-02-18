import {  Dish, DishEditInput, DishInput, PopInput } from "../components/interfaces";
import Cookies from "universal-cookie"; 
import { axiosPublic } from "./axios";

const cookies = new Cookies();



export const fetchDishes = async ({ pageParam = 1, query = "", onlyNoProduct = false }) => {
  const response = await axiosPublic.get("/dishes/", {
      params: {
          page: pageParam,
          query: query,
          only_no_product: onlyNoProduct,
      },
  });
  return response.data;
};


export const getDishNames = async (): Promise<string[]> => {
  const response = await axiosPublic.get(`dishes/names/`, {
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
  });


  const data = await response.data
  return  data.dishes || []

}

export const checkDishExists = async (name: string) => {
  if (!name) return null;

  const response = await axiosPublic.get(`/checkDishName/`, {
    params: { name },
  });

  return response.data.exists;
};


export const fetchDish = async (id:number)  => { 
  const response = await axiosPublic.get(`/get-dish-by-id/${id}`, {
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': cookies.get("csrftoken")
      },
  });

  const data = await response.data
  const dish:Dish = data
  return dish
};

  
export const saveDish = async ({dish}: DishInput): Promise<number> => {
  const response = await axiosPublic.post(`dishes/`, dish);

  const data = await response.data


  return  data.id

}
  
export const editDish = async ({dish, id}: DishEditInput): Promise<void> => {
  await axiosPublic.put(`dishes/?id=${id}`,dish);

}
  
export const deleteDish = async ({id}: PopInput): Promise<string | void> => {
  const response = await axiosPublic.delete(`dishes/?id=${id}`, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    }, 
  });

  if (response.data.error) {
    const errorData = await response.data.error  
    return errorData.message;  
  }
}
