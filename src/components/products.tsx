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

	console.log(products)

  const [searchQuery, setSearchQuery] = useState<string>('');  
	const [editProduct, setEditProduct] = useState<number | null>(null);
 
	const navigate = useNavigate()


  const { popProduct } = usePopProduct();

	const filteredProducts = searchQuery
  ? [
      // First, filter products that start with the search query
      ...(products ? products.filter(product =>
        product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      ) : []),
      // Then, filter products that include the search query but do not start with it
      ...(products ? products.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      ) : [])
    ]
  : products ? products.slice().reverse() : [];

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
		<div className="bg-dark text-white p-3">
			<button className="btn btn-primary" onClick={() => navigate('/')}>Back to Diary</button>
      <button className="btn btn-primary" onClick={() => navigate('/dishes')}>Dishes</button>
			<h3 className="ms-3">Products</h3>
 
			<button onClick={() => setEditProduct(null)} className="btn btn-primary" data-bs-toggle='modal' data-bs-target='#modal' >Add product</button>

			<ProductForm onSubmitSuccess={() => setEditProduct(null)} onCancel={() => setEditProduct(null)}/>
			<div className="d-flex justify-content-center">
	  		<input className="form-control  my-3" style={{'maxWidth': '40em'}} type="text" placeholder="Search products..." 
						value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
			</div>
			
			<div className="container">
				{filteredProducts&& filteredProducts.length > 0 ? (
					<div className="row gy-4">
						{filteredProducts.map((product, index) => (
							<div className="col-md-3 col-sm-6 col-lg-2" key={index}>
								<div className="card" style={{ width: '100%' }}>
									<div className="card-img-container position-relative" style={{ height: '150px', overflow: 'hidden' }}>
										<img
											className="card-img-top position-absolute card-image"
											src={typeof product.image === "string" 
												? product.image // If `product.image` is a URL string, use it
												: 'media/products/food.jpg'
											}
											alt={product.name} 
										/>
										<div className="nutrition-info position-absolute bg-dark text-light d-flex flex-column justify-content-center align-items-center">
										<div className="d-flex justify-content-between w-100 p-1 px-2">
											<span>Calories:</span>
											<span>{product.calories}</span>
										</div>
										<div className="d-flex justify-content-between w-100 p-1 px-2">
											<span>Protein:</span>
											<span>{product.protein}g</span>
										</div>
										<div className="d-flex justify-content-between w-100 p-1 px-2">
											<span>Carbs:</span>
											<span>{product.carbohydrate}g</span>
										</div>
										<div className="d-flex justify-content-between w-100 p-1 px-2">
											<span>Fats:</span>
											<span>{product.fat}g</span>
										</div>
										</div>	
									</div>								
									<div className="card-body">
										<p style={{height: '5ch', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis'}}>{product.name}</p>
										<div>
											<button onClick={() => setEditProduct(product.id)} className="btn btn-primary me-2">Edit</button>
											<button onClick={() => handleDeleteProduct(product.id)}className="btn btn-danger">Delete</button>
										</div>
										{editProduct === product.id && (
											<div className="d-flex justify-content-center mt-3">
												<div className="bg-secondary text-black border rounded p-3 edit-container" style={{ maxWidth: '450px' }}>
													<EditProductForm onSubmitSuccess={() => setEditProduct(null)} onCancel={() => setEditProduct(null)} product={product}/>
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