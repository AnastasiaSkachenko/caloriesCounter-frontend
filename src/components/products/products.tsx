import {  useEffect, useState } from "react";
import { usePopProduct } from "../../hooks/caloriesCounter";
import { Product } from "../interfaces";
import ProductForm from "./ProductForm";
import Modal from "../Modal";
import ProductsGrid from "./productsGrid";
import useAuth from "../../hooks/useAuth";
import { Popover } from "bootstrap";
import Header from "../header";



const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');  
 	const [editProduct, setEditProduct] = useState<Product | null>(null);
	const [error, setError] = useState<string | null>(null)

	const { auth } = useAuth()
	const { popProduct } = usePopProduct();


  useEffect(() => {
    if (!auth.user) {
      const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
      popoverTriggerList.forEach((popoverTriggerEl) => {
        new Popover(popoverTriggerEl);
      });
    }
  }, [auth.user]);



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

	console.log(editProduct, 'edit product')
  
 
	return (
		<div className="bg-dark text-white p-3 pb-5 min-vh-100">
			<Header active="products" />

			<h3 className="ms-3">Products</h3>

			{auth.user ? (
				<button onClick={() => setEditProduct(null)} className="btn btn-primary" data-bs-toggle='modal' data-bs-target='#modal' >Add product</button>
			): (
				<span className="d-inline-block" tabIndex={0} data-bs-toggle= "popover" data-bs-trigger="hover focus" title="Login required" data-bs-placement="bottom" data-bs-content="You need to log in to create a product." data-bs-custom-class="custom-popover">
					<button  className="btn btn-primary" disabled >Add product</button>
				</span>
			)}


			<Modal id="modal" title="Create new product">
				<ProductForm onSubmitSuccess={() => setEditProduct(null)} onCancel={() => setEditProduct(null)} onError={(errorMessage) => setError(errorMessage)}/>
			</Modal>

			<Modal id="modalEdit" title="Edit product">
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