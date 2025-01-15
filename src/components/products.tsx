import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../utils/caloriesCounter";
import ProductForm from "./ProductForm"
import { useState } from "react";
import { usePopProduct } from "../hooks/caloriesCounter";
import { useNavigate } from "react-router-dom";



const CaloriesCounterProducts: React.FC = () => {
	const {
		status: statusProducts, error: errorProducts, isLoading: isLoadingProducts, refetch, data: products
	  } = useQuery({
		queryKey: ['products' ], 
		queryFn: () =>  fetchProducts()  , 
	});

  const [editProduct, setEditProduct] = useState<string| null>(null)
  const [addProduct, setAddProduct] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('');  
	const navigate = useNavigate()


  const { popProduct } = usePopProduct();

  const filteredProducts = searchQuery
	? products?.filter(product =>
		product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
	  )
	: products?.slice().reverse();



	const handleDeleteProduct = async (id: number) => {
	  const response = window.confirm('Are you sure you want to delete this product?');
	  if (response) {
		popProduct({ id });
	  } 
	  refetch()
	};
  
	
	if (isLoadingProducts) return <h1>Loading...</h1>;
	if (statusProducts === 'error') return <h1>{JSON.stringify(errorProducts)}</h1>;

	return (
		<>
			<button onClick={() => navigate('/')}>Back to Diary</button>
      <button onClick={() => navigate('/dishes')}>Dishes</button>
			<h3>Products</h3>
		  {addProduct ? (
			<ProductForm onSubmitSuccess={() => setAddProduct(false)} onCancel={() => setAddProduct(false)}/>
	  ): (
		<button onClick={() => setAddProduct(true)}>Add product</button>
	  )}
	  <input
			  type="text"
			  placeholder="Search products..."
			  value={searchQuery}
			  onChange={(e) => setSearchQuery(e.target.value)}
		  />
		
		  { filteredProducts ? filteredProducts?.map((product, index) => (
			<div key={index}>
			  <p>{product.name} calories: {product.calories} protein: {product.protein} carbohydrates: {product.carbohydrate} fat: {product.fat}</p>
			  <button onClick={() => setEditProduct(product.name)}>Edit</button>
			  <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
			  {editProduct == product.name && (
				<ProductForm onSubmitSuccess={() => setEditProduct(null)} onCancel={() => setEditProduct(null)} product={product}/>
			  )}
			</div>
		  )) : (
			<p>No products match your search</p>
		  )}
		</>
	)
}

export default CaloriesCounterProducts