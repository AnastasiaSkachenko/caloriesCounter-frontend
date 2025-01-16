import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../utils/caloriesCounter";
import ProductForm from "./ProductForm"
import { useState } from "react";
import { usePopProduct } from "../hooks/caloriesCounter";
import { useNavigate } from "react-router-dom";
import '../../styles/style.css';
import '../index.css'
import EditProductForm from "./editProductForm";



const CaloriesCounterProducts: React.FC = () => {
	const {
		status: statusProducts, error: errorProducts, isLoading: isLoadingProducts, refetch, data: products
	  } = useQuery({
		queryKey: ['products' ], 
		queryFn: () =>  fetchProducts()  , 
	});

  const [searchQuery, setSearchQuery] = useState<string>('');  
	const [editProduct, setEditProduct] = useState<number | null>(null);
 
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
		<div className="bg-dark text-white">
			<button className="btn btn-primary" onClick={() => navigate('/')}>Back to Diary</button>
      <button onClick={() => navigate('/dishes')}>Dishes</button>
			<h3>Products</h3>
 
			<button className="btn btn-primary" data-bs-toggle='modal' data-bs-target='#modal' >Add product</button>

			<div className=' modal fade  form p-2 m-2 ' id='modal'> 
				<div className='  modal-dialog modal-dialog-centered' >
					<div className='bg-secondary text-black modal-content'>
						<h3 className='modal-header'>Create new product</h3>
						<ProductForm/>
					</div>
				</div>
			</div>


	  	<input
			  type="text"
			  placeholder="Search products..."
			  value={searchQuery}
			  onChange={(e) => setSearchQuery(e.target.value)}
		  />
		
		  { filteredProducts ? filteredProducts?.map((product, index) => (
			<div key={index}>
			  <p>{product.name} calories: {product.calories} protein: {product.protein} carbohydrates: {product.carbohydrate} fat: {product.fat}</p>
			  <button onClick={() => setEditProduct(product.id)} className="btn btn-primary">Edit</button>
				<button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
				{editProduct == product.id &&  
					<div className="d-flex   justify-content-center "  >
						<div className='bg-secondary border rounded p-3' style={{maxWidth: '600px'}}>
							<EditProductForm onCancel={() => setEditProduct(null)} product={product}/>
						</div>
					</div>}
			</div>
		  )) : (
			<p>No products match your search</p>
		  )}
		</div>
	)
}

export default CaloriesCounterProducts