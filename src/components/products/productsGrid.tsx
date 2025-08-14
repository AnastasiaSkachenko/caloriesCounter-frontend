import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import Card from "./Card";
import { ProductGridProps } from "../props";
import { useProducts } from "../../hooks/mutations/products";


const ProductsGrid: React.FC<ProductGridProps> = ({ searchQuery, setEditProduct, deleteProduct, currentUser }) => {
  const { ref, inView } = useInView();
  
  // Call the custom hook to fetch products
  const { status, products, fetchNextPage, isFetchingNextPage, hasNextPage, message } = useProducts({
    searchQuery
  });


  // Fetch more products when trigger point is in view
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
            <div className="col-4 col-md-4 col-lg-2 col-xl-3 " key={product.id}>
              <Card key={product.name} product={product} setEditProduct={setEditProduct} deleteProduct={deleteProduct} currentUser={currentUser}/>
            </div>
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