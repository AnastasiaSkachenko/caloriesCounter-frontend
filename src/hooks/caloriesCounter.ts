import { useQueryClient, useMutation } from "@tanstack/react-query"
import {  DiaryRecordInput, DishEditInput, DishInput, Ingredient, IngredientInput, PopInput, Product, ProductEditInput, ProductInput } from "../components/interfaces"
import { deleteDiaryRecord, deleteDish, deleteIngredient, deleteProduct, editDiaryRecord, editDish, editIngredient, editProduct, saveDiaryRecord, saveDish, saveIngredient, saveProduct } from "../utils/caloriesCounter"


//                                                                                                                                        for product
export const useSetProduct = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: setProduct} = useMutation<Product, Error, ProductInput>({
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
    const {mutateAsync: putProduct} = useMutation<void, Error, ProductEditInput>({
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
