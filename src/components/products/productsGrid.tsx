import { useInView } from "react-intersection-observer";
import { Product } from "../interfaces";
import { useProducts } from "../../hooks/caloriesCounter";
import { useEffect } from "react";

interface ProductGrid {
  searchQuery: string;
  setEditProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
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
    <div className="container">
      {products && products.length > 0 ? (
        <div className="row gy-4">
          {products.map((product) => (
            <div className="col-md-3 col-sm-6 col-lg-2" key={product.id}>
              <div className="card" style={{ width: "100%" }}>
                <div className="card-img-container position-relative" style={{ height: "130px", overflow: "hidden" }}>
                  <img
                    className="card-img-top position-absolute card-image"
                    src={typeof product.image === "string" ? product.image : "media/products/food.jpg"}
                    alt={product.name}
                    loading="lazy"
                    aria-label={`Image of ${product.name}`}
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
                  <p className="text-secondary mb-0">{product.user === currentUser ? "Own product" : "Other creator"}</p>
                  <div>
                    <button onClick={() => setEditProduct(product)} className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#modalEdit">
                      Edit
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="btn btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
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
