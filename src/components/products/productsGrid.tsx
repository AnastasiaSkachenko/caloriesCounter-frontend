import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../utils/product";
import { useEffect, useMemo } from "react";
import '../../style.css';
import '../../index.css'
import { useInView } from "react-intersection-observer";
import { Product } from "../interfaces";

interface ProductGrid {
  searchQuery: string,
  setEditProduct: (product: Product) => void,
  deleteProduct: (id: number) => void,
  currentUser: number
}


const ProductsGrid: React.FC<ProductGrid> = ({searchQuery, setEditProduct, deleteProduct, currentUser}) => {
	const { ref, inView} = useInView()

	const {
		status,
		error,
		data,
		refetch,
		fetchNextPage,
	} = useInfiniteQuery({
		queryKey: ['products', searchQuery], // Include searchQuery in queryKey
		queryFn: fetchProducts,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasMore ? allPages.length + 1 : undefined,
	})

	useEffect(() => {
		if (inView){
			fetchNextPage()
		}
	}, [inView, fetchNextPage])

	useEffect(() => {
		refetch(); // Refetch when searchQuery changes
	}, [searchQuery, refetch]);

 
  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.products) || [];
  }, [data]);
	console.log(data?.pageParams, 'params', data?.pages, 'pages')
 



	
	if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;
	if (status === 'pending') return <div className="bg-dark vh-100"><h1>Loading...</h1></div>;

	return (

    <div className="container">
      {products && products.length > 0 ? (
        <div className="row gy-4">
          {products.map((product, index) => (
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
                  <p className="product-name mb-0">{product.name}</p>
                  <p className="text-secondary mb-0"> {product.user == currentUser ? 'Own product': 'Other creator'}</p>
                  <div>
                    <button onClick={() => setEditProduct(product)} className="btn btn-primary me-2"  data-bs-toggle='modal' data-bs-target='#modalEdit'>Edit</button>
                    <button onClick={() => deleteProduct(product.id)}className="btn btn-danger">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products match your search</p>
      )}
      <div className="p-5" ref={ref}> </div>

    </div>

	)
}

export default ProductsGrid