import { useInView } from "react-intersection-observer";
import { Product } from "../interfaces";
import { useProducts } from "../../hooks/caloriesCounter";
import { useEffect } from "react";
import Card from "./Card";

interface ProductGrid {
  searchQuery: string;
  setEditProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  currentUser: number;
}


const ProductsGrid: React.FC<ProductGrid> = ({ searchQuery, setEditProduct, deleteProduct, currentUser }) => {
  const { ref, inView } = useInView();
  

  // Call the custom hook to fetch products
  const { status, products, fetchNextPage, isFetchingNextPage, hasNextPage, message } = useProducts({
    searchQuery
  });



  // Fetch more products when in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, hasNextPage]);

  if (status === "error") return <div className="error-message">{message ?? 'Something went wrong'}</div>;
  if (status === "pending") return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="container-fluid">
      {products && products.length > 0 ? (
        <div className="row gy-4">
          {products.map((product) => (
            <Card key={product.name} product={product} setEditProduct={setEditProduct} deleteProduct={deleteProduct} currentUser={currentUser}/>
          ))}
        </div>
      ) : (
        <p>No products match your search</p>
      )}
      <div className="p-5" ref={ref}></div>
    </div>
  );
};

export default ProductsGrid;
