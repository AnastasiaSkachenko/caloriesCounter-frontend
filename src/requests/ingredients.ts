import {  Ingredient, Product } from "../components/interfaces";
import { axiosPublic } from "../utils/axios";


export const fetchIngredient = async (id: number) => { 
  const response = await axiosPublic.get(`/ingredient/${id}}`)

  const data = await response.data
  const ingredient:Ingredient = data.ingredient
  const product: Product = data.product
  return {ingredient, product}
};
   

export const saveIngredient = async ({ingredient}: {ingredient: Ingredient}): Promise<Ingredient> => {
  const response = await axiosPublic.post(`/ingredient/`, ingredient)
  return  response.data
}
   
export const editIngredient = async ({ingredient}: {ingredient: Ingredient}): Promise<void> => {
  const response = await axiosPublic.put(`/ingredient/${ingredient.id}`, ingredient)
 
  if (response.data.error) {
    await response.data.error; 
  }
}
  

export const deleteIngredient = async ({id}: {id: string}): Promise<string | void> => {
  const response = await axiosPublic.delete(`/ingredient/${id}`)

  if (response.data.error) {
    const errorData = await response.data.error;  
    return errorData.message;  
  }
}