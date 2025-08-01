import { useEffect } from "react";
import { usePopDish, useToggleFavorite } from "../../hooks/caloriesCounter";
import useAuth from "../../hooks/useAuth";
import { Dish } from "../interfaces";
import { Popover } from "bootstrap";
import { baseImageUrl } from "../../utils/production";
 
interface PreMadeDishProps {
  dish: Dish;
  setEditDish: (dish: Dish) => void;
}



const PreMadeDishCard: React.FC<PreMadeDishProps> = ({dish, setEditDish}) => {
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
    <div className="d-flex flex-column bg-light border rounded p-3 dish-card" >
      <div className="d-flex justify-content-between">
        <p className="text-secondary my-1"> {dish.user == auth.user?.id ? 'Own dish': 'Other creator'}</p>

        {auth.user ? (
          <button  type="button"  onClick={handleFavoriteToggle} disabled={mutation.isPending} className="bg-transparent p-0 m-0 transparent-btn"><i className={`fa-${ auth.favoriteDishes?.includes(dish.id) ? "solid":'regular'} fa-star fa-xl`} style={{color: '#ffc800'}}></i></button>
        ): (
          <span className="d-inline-block" tabIndex={0} data-bs-toggle= "popover" data-bs-trigger="hover focus" title="Login required" data-bs-placement="top" data-bs-content="You need to log it to save this dish." data-bs-custom-class="custom-popover">
            <button  type="button"   disabled  className="bg-transparent p-0 m-0 transparent-btn" ><i className={`fa-${ auth.favoriteDishes?.includes(dish.id) ? "solid":'regular'} fa-star fa-xl`} style={{color: '#ffc800'}}></i></button>
          </span>
        )}
        
      </div>

      <div className="d-flex justify-content-center mb-2 dish-img-container" >
        <img className="border rounded dish-img"
          src={ baseImageUrl +( typeof dish.image === "string" ?  dish.image : "/media/dishes/food.jpg")}
          alt={dish.name} 
        />
      </div>
      <div className="d-flex flex-column flex-grow-1 justify-content-between   dish-body">
        <h3 className="card-name" >{dish.name} </h3>
        <div className=" d-flex align-items-center p-1">
          <div className=" d-flex align-items-around flex-column">   
            <div>
              <p className="fw-bold my-1">Nutrition value for one portion ({dish.portion} g):</p>
              Calories: {Math.round(dish.calories_100*dish.portion/100)}, Protein: {Math.round(dish.protein_100*dish.portion/100)}, Carbs: {Math.round(dish.carbs_100*dish.portion/100)}, Fats: {Math.round(dish.fat_100*dish.portion/100)} , Fiber: {Math.round(dish.fiber_100*dish.portion/100)}, Sugars: {Math.round(dish.sugars_100*dish.portion/100)}, Caffeine: {Math.round(dish.caffeine*dish.portion/100)}
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

  )
}

export default PreMadeDishCard