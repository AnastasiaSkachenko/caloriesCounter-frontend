import { useQueryClient, useMutation } from "@tanstack/react-query"
import {  DiaryRecordInput, DishEditInput, DishInput, Ingredient, IngredientInput } from "../components/interfaces"
import { deleteIngredient, editIngredient, saveIngredient } from "../utils/ingredients"
import { deleteDish, editDish, saveDish, toggleFavorite } from "../utils/dish"
import { deleteDiaryRecord, editDiaryRecord } from "../utils/diary"
import useAuth from "./useAuth"
import useAxiosPrivate from "./useAxiosPrivate"



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
    const {mutateAsync: popIngredient} = useMutation<string | void, Error, {id: string}>({
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
    const {mutateAsync: setDish} = useMutation<string, Error, DishInput>({
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
    const {mutateAsync: popDish} = useMutation<string | void, Error, { id: string}>({
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
    const {mutateAsync: popDiaryRecord} = useMutation<string | void, Error, {id:string}>({
        mutationFn: deleteDiaryRecord,
        onSuccess: () => { 
            queryClient.invalidateQueries({queryKey: ['diaryRecords']}) 
        }
    })

    return {popDiaryRecord,}
}




export const useToggleFavorite = (dishId: string, initialFavorite: boolean) => {
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
