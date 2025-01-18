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
      <button className="btn btn-primary" onClick={() => navigate('/dishes')}>Dishes</button>
			<h3>Products</h3>
 
			<button onClick={() => setEditProduct(null)} className="btn btn-primary" data-bs-toggle='modal' data-bs-target='#modal' >Add product</button>

			<div className=' modal fade  form p-2 m-2 ' id='modal'> 
				<div className='  modal-dialog modal-dialog-centered' >
					<div className='bg-secondary text-black modal-content'>
						<h3 className='modal-header'>Create new product</h3>
						<ProductForm onSubmitSuccess={() => setEditProduct(null)} onCancel={() => setEditProduct(null)}/>
					</div>
				</div>
			</div>
	  	<input className="form-control form-control-sm" style={{'maxWidth': '20em'}} type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
			
			<div className="container">
				{filteredProducts&& filteredProducts.length > 0 ? (
					<div className="row gy-4">
						{filteredProducts.map((product, index) => (
							<div className="col-md-3 col-sm-6 col-lg-2" key={index}>
								<div className="card" style={{ width: '100%' }}>
									<img className="card-img-top" src="/public/food.jpg" style={{ maxWidth: '100%', height: 'auto' }}alt={product.name}/>
									<div className="card-body">
										<p>{product.name}</p>
										<div>
											<button onClick={() => setEditProduct(product.id)} className="btn btn-primary me-2">Edit</button>
											<button onClick={() => handleDeleteProduct(product.id)}className="btn btn-danger">Delete</button>
										</div>
										{editProduct === product.id && (
											<div className="d-flex justify-content-center mt-3">
												<div className="bg-secondary text-black border rounded p-3" style={{ maxWidth: '450px' }}>
													<EditProductForm onCancel={() => setEditProduct(null)} product={product}/>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p>No products match your search</p>
				)}
			</div>
		</div>
	)
}

export default CaloriesCounterProducts