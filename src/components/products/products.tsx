import {  useEffect, useState } from "react";
import { Product } from "../interfaces";
import ProductForm from "./ProductForm";
import Modal from "../general/Modal";
import ProductsGrid from "./productsGrid";
import useAuth from "../../hooks/useAuth";
import { Popover } from "bootstrap";
import Button from "../../customComponents/Button";
import Header from "../general/header";
import { useProductMutations } from "../../hooks/mutations/products";


const Products = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');  
 	const [editProduct, setEditProduct] = useState<Product | null>(null);
	const [error, setError] = useState<string | null>(null)

	const { auth } = useAuth()
	const { popProduct } = useProductMutations();

	// if user is not authenticated create popover element that warns that some functionality is unavailable for anonymous users
  useEffect(() => {
    if (!auth.user) {
      const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
      popoverTriggerList.forEach((popoverTriggerEl) => {
        new Popover(popoverTriggerEl);
      });
    }
  }, [auth.user]);

	//timer for the popover error
	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError(null)
			}, 4000);
			return () => clearTimeout(timer);
		}
	}, [error])
	
 	const handleDeleteProduct = async (id: string) => {
		const responseError = await  popProduct({ id });
		if (responseError) {
			setError(responseError)
		}
	};
  
 
	return (
		<div className="bg-dark text-white p-3 pb-5 min-vh-100">
			<Header active="products" />

			<h3 className="ps-2">Products</h3>

			{auth.user ? (
				<Button
					onClick={() => setEditProduct(null)} 
					data-bs-toggle='modal' 
					data-bs-target='#modal'
					text="Add product"
					variant="submit"
					className="ms-2"
				/>
			): (
				<span className="d-inline-block" tabIndex={0} data-bs-toggle= "popover" data-bs-trigger="hover focus" title="Login required" data-bs-placement="bottom" data-bs-content="You need to log in to create a product." data-bs-custom-class="custom-popover">
					<Button disabled >Add product</Button>
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
	  		<input className="form-control py-2 my-3" style={{'maxWidth': '40em'}} type="text" placeholder="Search products..." 
						value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
			</div>

			<ProductsGrid  searchQuery={searchQuery} setEditProduct={(product) => setEditProduct(product)} deleteProduct={(id) => handleDeleteProduct(id)} currentUser={auth.user?.id ?? 0}/>
		</div>
	)
}

export default Products