import {  useEffect, useState } from "react";
import { usePopProduct } from "../../hooks/caloriesCounter";
import { useNavigate } from "react-router-dom";
import { Product } from "../interfaces";
import ProductForm from "./ProductForm";
import Modal from "../Modal";
import ProductsGrid from "./productsGrid";
import useAuth from "../../hooks/useAuth";



const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');  
 	const [editProduct, setEditProduct] = useState<Product | null>(null);
	const [error, setError] = useState<string | null>(null)

	const navigate = useNavigate()
	const { auth } = useAuth()
	const { popProduct } = usePopProduct();


	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError(null)
			}, 4000);
			return () => clearTimeout(timer);
		}
	}, [error])
	

 	const handleDeleteProduct = async (id: number) => {

		const responseError = await  popProduct({ id });
		if (responseError) {
			setError(responseError)
		}
	   
	};
  
 
	return (
		<div className="bg-dark text-white p-3 pb-5 min-vh-100">
			<button className="btn btn-primary" onClick={() => navigate('/')}>Diary</button>
      <button className="btn btn-primary" onClick={() => navigate('/dishes')}>Dishes</button>
			<button onClick={() => navigate('/profile')} className="btn btn-primary">Profile <i className="bi bi-person"></i></button>

			<h3 className="ms-3">Products</h3>
 
			<button onClick={() => setEditProduct(null)} className="btn btn-primary" data-bs-toggle='modal' data-bs-target='#modal' >Add product</button>

			<Modal id="modal" title="Create new product">
				<ProductForm onSubmitSuccess={() => setEditProduct(null)} onCancel={() => setEditProduct(null)} onError={(errorMessage) => setError(errorMessage)}/>
			</Modal>

			<Modal id="modalEdit" title="Edit product product">
				{editProduct && (
				<ProductForm onSubmitSuccess={() => setEditProduct(null)} onCancel={() => setEditProduct(null)} product={editProduct} onError={(errorMessage) => setError(errorMessage)}/>
				)}
			</Modal>
			{error && (
					<div className="alert alert-danger fixed-top end-0 m-3 mt-4" role="alert">
							{error}
					</div>
			)}
 			<div className="d-flex justify-content-center">
	  		<input className="form-control  my-3" style={{'maxWidth': '40em'}} type="text" placeholder="Search products..." 
						value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
			</div>

			<ProductsGrid  searchQuery={searchQuery} setEditProduct={(product) => setEditProduct(product)} deleteProduct={(id) => handleDeleteProduct(id)} currentUser={auth.user?.id ?? 0}/>
			
 
		</div>
	)
}

export default Products