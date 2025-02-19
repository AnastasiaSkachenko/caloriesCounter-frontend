import { DiaryRecord, DiaryRecordInput, Dish, DishEditInput, DishInput, Ingredient, IngredientInput, PopInput, Product } from "../components/interfaces";
import Cookies from "universal-cookie"; 
import { axiosPublic } from "./axios";

const cookies = new Cookies();

const production = false
const baseUrl = production ? window.location.origin : 'http://127.0.0.1:8000';


//                                                                                                                                   Products

  

//                                                                                                                                           Ingredients                                                                                                                  

export const fetchIngredient = async (id: number)  => { 
    const response = await fetch(`${baseUrl}/api/ingredient/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': cookies.get("csrftoken")

        },
      });
  
    if (!response.ok) {
        throw new Error("Failed to fetch ingredient data");
    }
  
    const data = await response.json() 
    const ingredient:Ingredient = data.ingredient
    const product: Product = data.product
    return {ingredient, product}
        
   
  };
   
  export const saveIngredient = async ({ingredient}: IngredientInput): Promise<Ingredient> => {
    const response = await fetch(`${baseUrl}/api/ingredient/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      body: JSON.stringify(ingredient),
    });
  
    if (!response.ok) {
        throw new Error("Failed to save ingredient data");
    }
    return  response.json()
  
  }
   
  export const editIngredient = async ({ingredient}: IngredientInput): Promise<void> => {
    const response = await fetch(`${baseUrl}/api/ingredient/${ingredient.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      body: JSON.stringify(ingredient),
    });
  
  if (!response.ok) {
    const errorData = await response.json(); // Parse error response
    throw new Error(errorData.error || "An error occurred");  }
  }
   
  export const deleteIngredient = async ({id}: PopInput): Promise<string | void> => {
    const response = await fetch(`${baseUrl}/api/ingredient/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      }, 
    });
  
    if (!response.ok) {
      const errorData = await response.json();  
      return errorData.message;  
    }
  }
  
//                                                                                                                                dishes

export const fetchDishes = async ({ pageParam = 1, query = "", onlyNoProduct = false }) => {
  const response = await axiosPublic.get("/api/dishes/", {
      params: {
          page: pageParam,
          query: query,
          only_no_product: onlyNoProduct,
      },
  });
  return response.data;
};


export const getDishNames = async (): Promise<string[]> => {
  const response = await fetch(`${baseUrl}/api/dishes/names/`, {
    method: "GET",
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
  });


  if (!response.ok) {
      throw new Error("Failed to get dish names");
  }
  const data = await response.json()
  return  data.dishes || []

}

export const checkDishExists = async (name: string) => {
  if (!name) return null;

  const response = await axiosPublic.get(`/api/checkDishName/`, {
    params: { name },
  });

  return response.data.exists;
};





export const fetchDish = async (id:number)  => { 
  const response = await fetch(`${baseUrl}/api/get-dish-by-id/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': cookies.get("csrftoken")
      },
  });

  if (!response.ok) {
      throw new Error("Failed to fetch dishes data");
  }

  const data = await response.json() 
  const dish:Dish = data
  return dish
};
//see if used
export const fetchDishIngredients = async ()  => { 
    const response = await fetch(`${baseUrl}/api/dishIngredients/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': cookies.get("csrftoken")

        },
    });
  
    if (!response.ok) {
        throw new Error("Failed to fetch dish ingredients data");
    }
  
    const data = await response.json() 
    return data.ingredients  ?? ''
        
};

  
export const saveDish = async ({dish}: DishInput): Promise<number> => {
  const response = await fetch(`${baseUrl}/api/dishes/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    body: dish,

  });

  if (!response.ok) {
      throw new Error("Failed to save dish data");
  }

  const data = await response.json()


  return  data.id

}
  
export const editDish = async ({dish, id}: DishEditInput): Promise<void> => {
  const response = await fetch(`${baseUrl}/api/dishes/?id=${id}`, {
    method: "PUT",
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    body: dish,
  });

if (!response.ok) {
    throw new Error("Failed to edit dish data");
}
}
  
export const deleteDish = async ({id}: PopInput): Promise<string | void> => {
  const response = await fetch(`${baseUrl}/api/dishes/?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    }, 
  });

  if (!response.ok) {
    const errorData = await response.json();  
    return errorData.message;  
  }
}


export const fetchDiaryRecords = async ()  => { 
  const response = await fetch(`${baseUrl}/api/diary-record/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': cookies.get("csrftoken")
      },
  });

  if (!response.ok) {
      throw new Error("Failed to fetch diary records data");
  }

  const data = await response.json() 
  const diaryRecords:DiaryRecord[] = data.diaryRecords
  return diaryRecords ?? []
};

export const saveDiaryRecord = async ({diaryRecord}: DiaryRecordInput): Promise<void> => {
  const response = await fetch(`${baseUrl}/api/diary-record/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    body: JSON.stringify(diaryRecord),

  });

  if (!response.ok) {
      throw new Error("Failed to save diary record data");
  }
}
  
export const editDiaryRecord = async ({diaryRecord}: DiaryRecordInput): Promise<void> => {
  const response = await fetch(`${baseUrl}/api/diary-record/${diaryRecord.id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    body: JSON.stringify(diaryRecord),
  });

  if (!response.ok) {
      throw new Error("Failed to save dish data");
  }
}
  
export const deleteDiaryRecord = async ({id}: PopInput): Promise<string | void> => {
  const response = await fetch(`${baseUrl}/api/diary-record/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
    }, 
  });

  if (!response.ok) {
    const errorData = await response.json();  
    return errorData.message;  
  }
}





