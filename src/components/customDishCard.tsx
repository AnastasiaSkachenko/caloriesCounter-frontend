import React  from "react";
import { Dish, Ingredient } from "./interfaces";
import { usePopDish } from "../hooks/caloriesCounter";

interface CustomDishProps {
  dish: Dish;
  setEditDish: (dish: Dish) => void;
}

const CustomDishCard: React.FC<CustomDishProps> = ({ dish, setEditDish }) => {
  const { popDish } = usePopDish()

  const handleDeleteDish = (id:number) => {
    const response = window.confirm('Are you sure you want to delete this dish?');
    if (response) {
      popDish({ id });
    }
  }

 
  return (
    <div className="custom-dish-container">
      <div className="myCard bg-light " >
        <div className="front">
          <div className="d-flex justify-content-center m-3" style={{ height: "12em", overflow: "hidden" }}>
            <img className="border rounded"
              src={
                typeof dish.image === "string"
                  ? dish.image
                  : "media/dishes/food.jpg"
              }
              alt={dish.name}
              style={{ width: "15em", height: "100%", objectFit: "cover" }}
            />
          </div>
          <h3 className="ms-3 " style={{height:'2.2em'}}>{dish.name} ({dish.portions + (dish.portions > 1 ? " portions" : " portion")})</h3>
          <div className=" d-flex align-items-center p-1 ms-3" style={{height: '12em'}} >
            <div>   
              <div className="mb-4">
                <p className="fw-bold my-0">Macros for total:</p>
                Calories: {dish.calories}, Protein: {dish.protein}, Carbs: {dish.carbohydrate}, Fats: {dish.fat}  
              </div>
              <div >
                <p className="fw-bold my-0">Macros for  1 portion ({dish.portion} g): </p>
                Calories: {Math.round(dish.calories_100*dish.portion /100)}, Protein: {Math.round(dish.protein*dish.portion/100)}, Carbs: {Math.round(dish.carbohydrate_100*dish.portion/100)}, Fats: {Math.round(dish.fat_100*dish.portion/100)}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <button onClick={() => setEditDish(dish)} data-bs-toggle="modal" data-bs-target="#modalEditDish">
              Edit dish
            </button>
            <button onClick={() => handleDeleteDish(dish.id ?? 0)}>Delete Dish</button>
          </div>

        </div>
        <div className="back bg-light  p-3">
          <div>
            <div className="d-flex align-items-center " style={{height: '10em'}}>
              <div>
                 <p className=" my-0"> <b>Ingredients: </b>
                  {dish.ingredients &&
                    dish.ingredients
                      .map(
                        (ingredient: Ingredient) =>
                          `${ingredient.name}: ${ingredient.weight}g`
                      )
                      .join(", ")}
                  .
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center" style={{ height: '20em', width: '100%', overflow: 'hidden' }}>
              <div style={{ overflowY: 'auto', height: '100%' }}>
                <p   style={{ overflowWrap: 'break-word', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                  <b>Instructions:</b> {dish.description}
                </p>
              </div>
            </div>


          </div>
          <div className="d-flex justify-content-center">
            <button onClick={() => setEditDish(dish)} data-bs-toggle="modal" data-bs-target="#modalEditDish">
              Edit dish
            </button>
            <button onClick={() => handleDeleteDish(dish.id ?? 0)}>Delete Dish</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDishCard;
