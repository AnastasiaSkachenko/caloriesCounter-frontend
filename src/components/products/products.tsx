import {  useState } from "react";
import { usePopProduct } from "../../hooks/caloriesCounter";
import { useNavigate } from "react-router-dom";
import '../../style.css';
import '../../index.css'
import { Product } from "../interfaces";
import ProductForm from "./ProductForm";
import Modal from "../Modal";
import ProductsGrid from "./productsGrid";
import useAuth from "../../hooks/useAuth";



const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');  
 	const [editProduct, setEditProduct] = useState<Product | null>(null);
 
	const navigate = useNavigate()

	const {auth} = useAuth()


  const { popProduct } = usePopProduct();

 	const handleDeleteProduct = async (id: number) => {
	  const response = window.confirm('Are you sure you want to delete this product?');
	  if (response) {
		popProduct({ id });
	  } 
	};
  
	
 
	return (
		<div className="bg-dark text-white p-3 pb-5 vh-100">
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

			<ProductsGrid  searchQuery={searchQuery} setEditProduct={(product) => setEditProduct(product)} deleteProduct={(id) => handleDeleteProduct(id)} currentUser={auth.user?.id ?? 0}/>
			
 
		</div>
	)
}

export default Products