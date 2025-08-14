import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../useAuth";
import { deleteDish, editDish, fetchDishes, saveDish, toggleFavorite } from "../../requests/dish";
import { useDebounce } from "../../utils/utils";



export const useDishes = ({ searchQuery, filter }: { searchQuery: string, filter: string[]}) => {
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    status,
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["dishes", debouncedSearchQuery, true, filter], 
    queryFn: fetchDishes,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    staleTime: 500, 
  });

  const dishes = data?.pages?.flatMap((page) => page.dishes || []) || [];
  let message = "";

  const errorPage = data?.pages.find((page) => page.error);
  if (errorPage) {
    message = errorPage.error || "";
  }

  if (dishes.length === 0 && !message) {
    message = "No products found";
  }  
  return {
    message,
    status,
    dishes,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  };
};



export const useDishMutations = (dishId?: string, initialFavorite?: boolean) => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const toggleFavoriteDish = useMutation({
    mutationFn: async () => toggleFavorite(dishId ?? ""),
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

	const {mutateAsync: setDish} = useMutation<string, Error, {dish: FormData}>({
		mutationFn: saveDish,
		onSuccess: () => { 
				queryClient.invalidateQueries({queryKey: ['dishes']})
				queryClient.invalidateQueries({queryKey: ['dishIngredients']})
		}
	})

	const {mutateAsync: putDish} = useMutation<void, Error, {dish: FormData, id: string}>({
		mutationFn: editDish,
		onSuccess: () => { 
			queryClient.invalidateQueries({queryKey: ['dishes']})
			queryClient.invalidateQueries({queryKey: ['dishIngredients']})
		}
	})

	const {mutateAsync: popDish} = useMutation<string | void, Error, { id: string}>({
		mutationFn: deleteDish,
		onSuccess: () => { 
			queryClient.invalidateQueries({queryKey: ['dishes']})
			queryClient.invalidateQueries({queryKey: ['dishIngredients']})
		}
	})

  return {toggleFavoriteDish, setDish, putDish, popDish}
}