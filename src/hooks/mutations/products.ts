import { useDebounce } from "../../utils/utils";
import { deleteProduct, editProduct, fetchProducts, saveProduct } from "../../requests/product"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "../../components/interfaces";


export const useProducts = ({ searchQuery }: { searchQuery: string}) => {
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    status,
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", debouncedSearchQuery], 
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    staleTime: 500, 
  });

  const products = data?.pages?.flatMap((page) => page.products || []) || [];
  let message = "";

  const errorPage = data?.pages.find((page) => page.error);
  if (errorPage) {
    message = errorPage.error || "";
  }

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


export const useProductMutations = () => {
	const queryClient = useQueryClient()

	const {mutateAsync: setProduct} = useMutation<Product | string, Error, {product: FormData}>({
		mutationFn: saveProduct,
		onSuccess: () => { 
			queryClient.invalidateQueries({queryKey: ['products']})
			queryClient.invalidateQueries({queryKey: ['productNames']})
		}
	})

	const {mutateAsync: putProduct} = useMutation<void | string, Error, {product: FormData, id: string}>({
		mutationFn: editProduct,
		onSuccess: () => { 
			queryClient.invalidateQueries({queryKey: ['products']})
			queryClient.invalidateQueries({queryKey: ['productNames']})
		}
	})

	const {mutateAsync: popProduct} = useMutation<string | void, Error, {id: string}>({
		mutationFn: deleteProduct,
		onSuccess: () => { 
			queryClient.invalidateQueries({queryKey: ['products']})
			queryClient.invalidateQueries({queryKey: ['productNames']})
		}
	})

	return {setProduct, putProduct, popProduct}
}

