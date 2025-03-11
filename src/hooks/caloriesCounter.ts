import { useQueryClient, useMutation } from "@tanstack/react-query"
import {  DiaryRecordInput, DishEditInput, DishInput, Ingredient, IngredientInput, PopInput, Product, ProductEditInput, ProductInput } from "../components/interfaces"
import { deleteProduct, editProduct, fetchProducts, saveProduct } from "../utils/product"
import { deleteIngredient, editIngredient, saveIngredient } from "../utils/ingredients"
import { deleteDish, editDish, saveDish, toggleFavorite } from "../utils/dish"
import { deleteDiaryRecord, editDiaryRecord } from "../utils/diary"
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "../utils/utils"
import useAuth from "./useAuth"
import useAxiosPrivate from "./useAxiosPrivate"


// useProducts.ts

interface UseProductsParams {
  searchQuery: string;
}

export const useProducts = ({ searchQuery }: UseProductsParams) => {
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounced search query

  const {
    status,
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", debouncedSearchQuery], // Use debounced query
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    staleTime: 500, // Prevents excessive refetching
  });

  const products = data?.pages?.flatMap((page) => page.products || []) || [];
  let message = "";

  // Find any page with an error
  const errorPage = data?.pages.find((page) => page.error);
  if (errorPage) {
    message = errorPage.error || "";
  }

  // If no products and no error, show "No products found"
  if (products.length === 0 && !message) {
    message = "No products found";
  }  
  return {
    message,
    status,
    products,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  };
};



//                                                                                                                                        for product
export const useSetProduct = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: setProduct} = useMutation<Product | string, Error, ProductInput>({
        mutationFn: saveProduct,
        onSuccess: () => { 
            queryClient.invalidateQueries({queryKey: ['products']})
            queryClient.invalidateQueries({queryKey: ['productNames']})
        }
    })
    return {setProduct,}
}

export const usePutProduct = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: putProduct} = useMutation<void | string, Error, ProductEditInput>({
        mutationFn: editProduct,
        onSuccess: () => { 
            queryClient.invalidateQueries({queryKey: ['products']})
            queryClient.invalidateQueries({queryKey: ['productNames']})
        }
    })
    return {putProduct,}
}

export const usePopProduct = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: popProduct} = useMutation<string | void, Error, PopInput>({
        mutationFn: deleteProduct,
        onSuccess: () => { 
            queryClient.invalidateQueries({queryKey: ['products']})
            queryClient.invalidateQueries({queryKey: ['productNames']})

        }
    })

    return {popProduct,}
}


//                                                                                                                                        for ingredients

export const useSetIngredient = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: setIngredient} = useMutation<Ingredient, Error, IngredientInput>({
        mutationFn: saveIngredient,
        onSuccess: () => { 
            queryClient.invalidateQueries({queryKey: ['dishes']})
            queryClient.invalidateQueries({queryKey: ['dishIngredients']})
        }
    })
    return {setIngredient,}
}

export const usePutIngredient = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: putIngredient} = useMutation<void, Error, IngredientInput>({
        mutationFn: editIngredient,
        onSuccess: () => { 
            queryClient.invalidateQueries({queryKey: ['dishes']})
            queryClient.invalidateQueries({queryKey: ['dishIngredients']})

        }
    })
    return {putIngredient,}
}

export const usePopIngredient = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: popIngredient} = useMutation<string | void, Error, PopInput>({
        mutationFn: deleteIngredient,
        onSuccess: () => { 
            queryClient.invalidateQueries({queryKey: ['dishes']})
            queryClient.invalidateQueries({queryKey: ['dishIngredients']})
        }
    })

    return {popIngredient,}
}

//                                                                                                                                        for dishes

export const useSetDish = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: setDish} = useMutation<number, Error, DishInput>({
        mutationFn: saveDish,
        onSuccess: () => { 
            queryClient.invalidateQueries({queryKey: ['dishes']})
            queryClient.invalidateQueries({queryKey: ['dishIngredients']})
        }
    })
    return {setDish,}
}

export const usePutDish = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: putDish} = useMutation<void, Error, DishEditInput>({
        mutationFn: editDish,
        onSuccess: () => { 
            queryClient.invalidateQueries({queryKey: ['dishes']})
            queryClient.invalidateQueries({queryKey: ['dishIngredients']})
        }
    })
    return {putDish,}
}

export const usePopDish = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: popDish} = useMutation<string | void, Error, PopInput>({
        mutationFn: deleteDish,
        onSuccess: () => { 
            queryClient.invalidateQueries({queryKey: ['dishes']})
            queryClient.invalidateQueries({queryKey: ['dishIngredients']})
        }
    })

    return {popDish,}
}


 
//                                                                                                                                   for diary

export const useSetDiaryRecord = () => {
    const {saveDiaryRecord} = useAxiosPrivate()
    const queryClient = useQueryClient()
    const {mutateAsync: setDiaryRecord} = useMutation<void, Error, DiaryRecordInput>({
        mutationFn: saveDiaryRecord,
        onSuccess: () => {  
            queryClient.invalidateQueries({queryKey: ['diaryRecords']})
        }
    })
    return {setDiaryRecord,}
}

export const usePutDiaryRecord = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: putDiaryRecord} = useMutation<void, Error, DiaryRecordInput>({
        mutationFn: editDiaryRecord,
        onSuccess: () => {  
            queryClient.invalidateQueries({queryKey: ['diaryRecords']})
        }
    })
    return {putDiaryRecord,}
}

export const usePopDiaryRecord = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: popDiaryRecord} = useMutation<string | void, Error, PopInput>({
        mutationFn: deleteDiaryRecord,
        onSuccess: () => { 
            queryClient.invalidateQueries({queryKey: ['diaryRecords']}) 
        }
    })

    return {popDiaryRecord,}
}




export const useToggleFavorite = (dishId: number, initialFavorite: boolean) => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => toggleFavorite(dishId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["dish", dishId] });

      const previousState = queryClient.getQueryData<boolean>(["dish", dishId]) ?? initialFavorite;

      queryClient.setQueryData(["dish", dishId], (prev: boolean | undefined) => !prev);

      return { previousState };
    },
    onError: (_error, _newState, context) => {
      if (context?.previousState !== undefined) {
        queryClient.setQueryData(["dish", dishId], context.previousState);
      }
    },
    onSuccess: (updatedFavorite) => {
      queryClient.setQueryData(["dish", dishId], updatedFavorite);
      refreshUser();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dish", dishId] });
    },
  });

  return mutation;
};
