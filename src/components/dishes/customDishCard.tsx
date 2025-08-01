import React, { useEffect }  from "react";
import { Dish, Ingredient } from "../interfaces";
import { usePopDish, useToggleFavorite } from "../../hooks/caloriesCounter";
import useAuth from "../../hooks/useAuth";
import { Popover } from "bootstrap";
import { baseImageUrl } from "../../utils/production";

interface CustomDishProps {
  dish: Dish;
  setEditDish: (dish: Dish) => void;
}

const CustomDishCard: React.FC<CustomDishProps> = ({ dish, setEditDish }) => {
  const { popDish } = usePopDish()

  const { auth } = useAuth()

  useEffect(() => {
    if (!auth.user) {
      const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
      popoverTriggerList.forEach((popoverTriggerEl) => {
        new Popover(popoverTriggerEl);
      });
    }

  }, [auth.user]);


  const mutation = useToggleFavorite(dish.id, dish.favorite);


  const handleFavoriteToggle = () => {
    if (auth.user) {
      mutation.mutate();
    } 
  };



  const handleDeleteDish = (id:string) => {
    const response = window.confirm('Are you sure you want to delete this dish?');
    if (response) {
      popDish({ id });
    }
  }

 
  return (
    <div className="custom-dish-container dish-card">
      <div className="myCard bg-light " >
        <div className="front d-flex flex-column bg-light border rounded p-3 ">
          <div className="d-flex justify-content-between">
            <p className="text-secondary my-1" > {dish.user == auth.user?.id ? 'Own dish': 'Other creator'}</p>
            {auth.user ? (
              <button  type="button"  onClick={handleFavoriteToggle} disabled={mutation.isPending} className="bg-transparent p-0 m-0 transparent-btn"><i className={`fa-${ auth.favoriteDishes?.includes(dish.id) ? "solid":'regular'} fa-star fa-xl`} style={{color: '#ffc800'}}></i></button>
            ): (
              <span className="d-inline-block" tabIndex={0} data-bs-toggle= "popover" data-bs-trigger="hover focus" title="Login required" data-bs-placement="top" data-bs-content="You need to log it to save this dish." data-bs-custom-class="custom-popover">
                <button  type="button"   disabled  className="bg-transparent p-0 m-0 transparent-btn" ><i className={`fa-${ auth.favoriteDishes?.includes(dish.id) ? "solid":'regular'} fa-star fa-xl`} style={{color: '#ffc800'}}></i></button>
              </span>
            )}
          </div>

          <div className="d-flex justify-content-center mb-2 dish-img-container">
            <img className="border rounded dish-img"

              src={ baseImageUrl +( typeof dish.image === "string" ?  dish.image : "/media/dishes/food.jpg")}
              
              alt={dish.name}
              
            />
          </div>
          <div className="d-flex  flex-column flex-grow-1 justify-content-between">
            <h3 className="card-name "  >{dish.name} ({dish.portions + (dish.portions > 1 ? " portions" : " portion")})</h3>
            <p>{dish.id}</p>
            <div className="d-flex align-items-center p-1 dish-body">
              <div className=" d-flex align-items-around flex-column">   
                <div >
                  <p className="fw-bold my-1">Macros for  1 portion ({dish.portion} g): </p>
                  Calories: {Math.round(dish.calories_100*dish.portion /100)}, Protein: {Math.round(dish.protein_100*dish.portion/100)}, Carbs: {Math.round(dish.carbs_100*dish.portion/100)}, Fats: {Math.round(dish.fat_100*dish.portion/100)}, Fiber: {Math.round(dish.fiber_100*dish.portion/100)}, Sugars: {Math.round(dish.sugars_100*dish.portion/100)}, Caffeine: {Math.round(dish.caffeine*dish.portion/100)}
                </div>
                <div>
                  <p className="fw-bold my-1">Nutrition value for  100g: </p>
                  Calories: {dish.calories_100}, Protein: {dish.protein_100}, Carbs: {dish.carbs_100}, Fats: {dish.fat_100}, Fiber: {dish.fiber_100}, Sugars: {dish.sugars_100}, Caffeine: {dish.caffeine_100}
                </div>
              </div>
            </div>
              
            <div className="d-flex justify-content-center">
              <button className="btn btn-warning" onClick={() => setEditDish(dish)} data-bs-toggle="modal" data-bs-target="#modalEditDish" disabled={auth.user?.id != dish.user}>
                Edit dish
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteDish(dish.id ?? '')} disabled={auth.user?.id != dish.user}>Delete Dish</button>
            </div>
          </div>
        </div>
        <div className="back bg-light p-3 d-flex flex-column bg-light border rounded justify-content-between">
          <div className="d-flex justify-content-end">
            {auth.user ? (
              <button  type="button"  onClick={handleFavoriteToggle} disabled={mutation.isPending} className="bg-transparent p-0 m-0 transparent-btn"><i className={`fa-${ auth.favoriteDishes?.includes(dish.id) ? "solid":'regular'} fa-star fa-xl`} style={{color: '#ffc800'}}></i></button>
            ): (
              <span className="d-inline-block" tabIndex={0} data-bs-toggle= "popover" data-bs-trigger="hover focus" title="Login required" data-bs-placement="top" data-bs-content="You need to log it to save this dish." data-bs-custom-class="custom-popover">
                <button  type="button"   disabled  className="bg-transparent p-0 m-0 transparent-btn" ><i className={`fa-${ auth.favoriteDishes?.includes(dish.id) ? "solid":'regular'} fa-star fa-xl`} style={{color: '#ffc800'}}></i></button>
              </span>
            )}
            
          </div>

          <div className="d-flex  flex-column flex-grow-1 justify-content-between">
            <div className="d-flex align-items-center " style={{maxHeight: '5em'}}>
              <div>
                 <p className=" my-0"> <b>Ingredients: </b>
                  {dish.ingredients &&
                    dish.ingredients
                      .map(
                        (ingredient: Ingredient) =>
                          `${ingredient.name}: ${ingredient.weight}g \n ${ingredient.id}`
                      )
                      .join(", ")}
                  .
                </p>
              </div>
            </div>

            <div >
              <p className="fw-bold my-1">Macros for total:</p>
              Calories: {dish.calories}, Protein: {dish.protein}, Carbs: {dish.carbs}, Fats: {dish.fat}, Fiber: {dish.fiber}, Sugars: {dish.sugars}, Caffeine: {dish.caffeine}
            </div>



            <div className="d-flex align-items-center" style={{ maxHeight: '17em', width: '100%', overflow: 'hidden' }}>
              <div style={{ overflowY: 'auto', height: '100%' }}>
                <p   style={{ overflowWrap: 'break-word', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                  <b>Instructions:</b> {dish.description}
                </p>
              </div>
            </div>


          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-warning" onClick={() => setEditDish(dish)} data-bs-toggle="modal" data-bs-target="#modalEditDish" disabled={auth.user?.id != dish.user}>
              Edit dish
            </button>
            <button className="btn btn-danger" onClick={() => handleDeleteDish(dish.id ?? 0)} disabled={auth.user?.id != dish.user}>Delete Dish</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDishCard;
