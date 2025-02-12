import { DiaryRecord, DiaryRecordInput, Dish, DishEditInput, DishInput, Ingredient, IngredientInput, PopInput, Product, ProductEditInput, ProductInput } from "../components/interfaces";
import Cookies from "universal-cookie"; 

const cookies = new Cookies();

const production = false
const baseUrl = production ? window.location.origin : 'http://127.0.0.1:8000';


//                                                                                                                                   Products

export const fetchProducts = async ({ pageParam = 1, queryKey }: { pageParam?: number, queryKey: string[] }) => {
  const [, query] = queryKey; // Extract query from queryKey

  const params = new URLSearchParams();
  params.append("page", pageParam.toString());
  if (query) params.append("query", query);

  const url = `${baseUrl}/api/products/?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'X-CSRFToken': cookies.get("csrftoken"),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product data");
  }

  const data = await response.json();
  return { products: data.products, hasMore: data.has_more, currentPage: pageParam };
};



export const saveProduct = async ({product}: ProductInput): Promise<Product> => {
  const response = await fetch(`${baseUrl}/api/products/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    body:product,
  });

  if (!response.ok) {
      throw new Error("Failed to save product data");
  }
  return  response.json()

}
 
export const editProduct = async ({product, id}: ProductEditInput): Promise<void> => {
  const response = await fetch(`${baseUrl}/api/products/?id=${id}`, {
    method: "PUT",
    headers: {
      "X-CSRFToken": cookies.get("csrftoken"),
    },
    body:product,
  });

if (!response.ok) {
    throw new Error("Failed to save product data");
}
}
 
export const deleteProduct = async ({id}: PopInput): Promise<string | void> => {
  const response = await fetch(`${baseUrl}/api/products/?id=${id}`, {
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


export const fetchProductNames = async (  )  => { 
  const response = await fetch(`${baseUrl}/api/products/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': cookies.get("csrftoken")
      },
    });

  if (!response.ok) {
      throw new Error("Failed to fetch product data");
  }

  const data = await response.json() 
  const products:Product[] = data.products 
  const productNames: string[] = []
  products.map(product => {
    productNames.push(product.name)
  })

   return productNames
      
 
};


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

export const fetchDishes = async ({ pageParam } : {pageParam?: number}): Promise<{ dishes: Dish[], hasMore?: boolean, currentPage?: number }>  => { 
    const response = await fetch(`${baseUrl}/api/dishes/${pageParam ? '?page=' + pageParam : ''}`, {
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
    return { dishes: data.dishes, hasMore: data.has_more, currentPage: pageParam};
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

  const id = await response.json()


  return  id

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
