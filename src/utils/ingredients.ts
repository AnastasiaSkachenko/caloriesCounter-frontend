import {  Ingredient, IngredientInput, Product } from "../components/interfaces";
import { axiosPublic } from "./axios";
import  Cookies  from 'universal-cookie'


const cookies = new Cookies()


export const fetchIngredient = async (id: number)  => { 
    const response = await axiosPublic.get(`/ingredient/${id}}`, {
    headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
        "Content-Type": "application/json",
    }})

    const data = await response.data
    const ingredient:Ingredient = data.ingredient
    const product: Product = data.product
    return {ingredient, product}
  };
   
export const saveIngredient = async ({ingredient}: IngredientInput): Promise<Ingredient> => {
  const response = await axiosPublic.post(`/ingredient/`, ingredient, {
    headers: {
      "Content-Type": "application/json",
    }
  })
  return  response.data
}
   
export const editIngredient = async ({ingredient}: IngredientInput): Promise<void> => {
  const response = await axiosPublic.put(`/ingredient/${ingredient.id}`, ingredient, {
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
      "Content-Type": "application/json",
    }
  })
 
  if (response.data.error) {
    await response.data.error; // Parse error response
  }
}
  
export const deleteIngredient = async ({id}: {id: string}): Promise<string | void> => {
  const response = await axiosPublic.delete(`/ingredient/${id}`, {
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
      "Content-Type": "application/json",
    },
  })

  if (response.data.error) {
    const errorData = await response.data.error;  
    return errorData.message;  
  }
}
