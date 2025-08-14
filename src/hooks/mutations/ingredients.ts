import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteIngredient, editIngredient, saveIngredient } from "../../requests/ingredients"
import { Ingredient } from "../../components/interfaces"


export const useIngredientMutations = () => {
	const queryClient = useQueryClient()

	const {mutateAsync: setIngredient} = useMutation<Ingredient, Error, {ingredient: Ingredient}>({
		mutationFn: saveIngredient,
		onSuccess: () => { 
			queryClient.invalidateQueries({queryKey: ['dishes']})
			queryClient.invalidateQueries({queryKey: ['dishIngredients']})
		}
	})

	const {mutateAsync: putIngredient} = useMutation<void, Error, {ingredient: Ingredient}>({
		mutationFn: editIngredient,
		onSuccess: () => { 
			queryClient.invalidateQueries({queryKey: ['dishes']})
			queryClient.invalidateQueries({queryKey: ['dishIngredients']})

		}
	})

	const {mutateAsync: popIngredient} = useMutation<string | void, Error, {id: string}>({
		mutationFn: deleteIngredient,
		onSuccess: () => { 
			queryClient.invalidateQueries({queryKey: ['dishes']})
			queryClient.invalidateQueries({queryKey: ['dishIngredients']})
		}
	})

	return {setIngredient, putIngredient, popIngredient}
}