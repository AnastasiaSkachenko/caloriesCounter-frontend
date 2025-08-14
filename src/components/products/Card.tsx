import { useState } from "react";
import Button from "../../customComponents/Button";
import MediaScroller from "./MediaScroller"
import { nutritionsProduct as nutritions } from "../../assets/constants/nutritions";
import { ProductCardProps } from "../props";


const Card:React.FC<ProductCardProps> = ({ product, setEditProduct, deleteProduct, currentUser }) => {
  const [viewNutrition, setViewNutrition] = useState(false)
  
  return (
    <div className="bg-dark border border-2 border-primary-light p-2 rounded-3" >
      <div className="card-img-container d-flex justify-content-center" >
        {viewNutrition ? (
          <div className="nutrition-info bg-primary-dark text-light d-flex flex-column justify-content-center align-items-center text-white">
            {nutritions.map(nutrition => (
              <div key={nutrition.title} className="d-flex justify-content-between w-100 p-1 px-2">
                <span>{nutrition.title}:</span>
                <span>{product[nutrition.value]} {nutrition.value == "caffeine" && "m"}g</span>
              </div>
            ))}
          </div>
        ): (
          <MediaScroller
            media={product.media}
            name={product.name}
            className=" h-full"
            bg="dark"
            width={320}
            height={225}
          />
        )}
      </div>
      <div className="card-body px-1 py-2 bg-light">
        <div className="d-flex w-full justify-content-end">
          <Button
            text="View Macros"
            variant="secondary"
            size="sm"
            className="me-1"
            onClick={() => setViewNutrition(!viewNutrition)}
          />
        </div>

        <p className="card-name mb-0 text-truncate ps-1">{product.name}</p>
        <p className="text-secondary mb-2 ps-1">{product.user === currentUser ? "Own product" : "Other creator"}</p>
        <div className="d-flex justify-content-center gap-2">
          <Button
            text="Edit"
            onClick={() => setEditProduct(product)} 
            data-bs-toggle="modal" 
            data-bs-target="#modalEdit"
            variant="edit"
          />
          
          <Button 
            onClick={() => deleteProduct(product.id)} 
            className="btn btn-danger"
            text="Delete"
            variant="delete"
            />                    
        </div>
      </div>
    </div>
  )
}

export default Card
