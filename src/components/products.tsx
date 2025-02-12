import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "../utils/caloriesCounter";
import { useEffect, useState } from "react";
import { usePopProduct } from "../hooks/caloriesCounter";
import { useNavigate } from "react-router-dom";
import '../../styles/style.css';
import '../index.css'
import { Product } from "./interfaces";
import { useInView } from "react-intersection-observer";
import ProductForm from "./ProductForm";
import Modal from "./Modal";



const Products: React.FC = () => {
  const {
    status,
    error,
    data,
    fetchNextPage, 
  } = useInfiniteQuery({
    queryKey: ['products'],   
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore && allPages ? allPages.length + 1 : undefined,
  });

	const { ref, inView} = useInView()

	useEffect(() => {
		if (inView){
			fetchNextPage()
		}
	}, [inView, fetchNextPage])

 
	const products = data?.pages.flatMap((page) => page.products) || [];
	console.log(data?.pageParams, 'params', data?.pages, 'pages')
  const [searchQuery, setSearchQuery] = useState<string>('');  
	const [editProduct, setEditProduct] = useState<Product | null>(null);
 
	const navigate = useNavigate()


  const { popProduct } = usePopProduct();

	const filteredProducts = searchQuery
  ? [
      ...(products ? products.filter(product =>
        product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      ) : []),
      ...(products ? products.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      ) : [])
    ]
  : products ? products : [];

	const handleDeleteProduct = async (id: number) => {
	  const response = window.confirm('Are you sure you want to delete this product?');
	  if (response) {
		popProduct({ id });
	  } 
	};
  
	
	if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;
	if (status === 'pending') return <h1>Loading...</h1>;

	return (
		<div className="bg-dark text-white p-3 pb-5">
			<button className="btn btn-primary" onClick={() => navigate('/')}>Diary</button>
      <button className="btn btn-primary" onClick={() => navigate('/dishes')}>Dishes</button>
			<button onClick={() => navigate('/profile')} className="btn btn-primary">Profile <i className="bi bi-person"></i></button>

			<h3 className="ms-3">Products</h3>
 
			<button onClick={() => setEditProduct(null)} className="btn btn-primary" data-bs-toggle='modal' data-bs-target='#modal' >Add product</button>

			<Modal id="modal" title="Create new product">
				<ProductForm onSubmitSuccess={() => setEditProduct(null)} onCancel={() => setEditProduct(null)}/>
			</Modal>

			<Modal id="modalEdit" title="Edit product product">
				{editProduct && (
				<ProductForm onSubmitSuccess={() => setEditProduct(null)} onCancel={() => setEditProduct(null)} product={editProduct}/>
				)}
			</Modal>

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
									<div className="card-img-container position-relative" style={{ height: '130px', overflow: 'hidden' }}>
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
									<div className="card-body py-2 bg-light">
										<p className="product-name">{product.name}</p>
										<div>
											<button onClick={() => setEditProduct(product)} className="btn btn-primary me-2"  data-bs-toggle='modal' data-bs-target='#modalEdit'>Edit</button>
											<button onClick={() => handleDeleteProduct(product.id)}className="btn btn-danger">Delete</button>
										</div>
 									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p>No products match your search</p>
				)}
			</div>
		<div className="p-5" ref={ref}> </div>

		</div>
	)
}

export default Products