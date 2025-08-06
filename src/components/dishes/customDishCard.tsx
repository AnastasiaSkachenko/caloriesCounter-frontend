import React, { useEffect }  from "react";
import { Dish } from "../interfaces";
import { usePopDish, useToggleFavorite } from "../../hooks/caloriesCounter";
import useAuth from "../../hooks/useAuth";
import { Popover } from "bootstrap";
import MediaScroller from "../products/MediaScroller";
import Button from "../../customComponents/Button";
import { useNavigate } from "react-router-dom";

interface CustomDishProps {
  dish: Dish;
  setEditDish: (dish: Dish) => void;
}

const CustomDishCard: React.FC<CustomDishProps> = ({ dish, setEditDish }) => {
  const { popDish } = usePopDish()
  const navigate = useNavigate()

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
    <div className=" d-flex flex-column bg-light border rounded p-3 ">
      <MediaScroller name={dish.name} media={dish.media} bg="dark" width={400} height={250} />
      <div className="d-flex justify-content-between mt-4">
        <p className="text-secondary my-1" > {dish.user == auth.user?.id ? 'Own dish': 'Other creator'}</p>
        {auth.user ? (
          <button  type="button"  onClick={handleFavoriteToggle} disabled={mutation.isPending} className="bg-transparent p-0 m-0 transparent-btn"><i className={`fa-${ auth.favoriteDishes?.includes(dish.id) ? "solid":'regular'} fa-star fa-xl`} style={{color: '#ffc800'}}></i></button>
        ): (
          <span className="d-inline-block" tabIndex={0} data-bs-toggle= "popover" data-bs-trigger="hover focus" title="Login required" data-bs-placement="top" data-bs-content="You need to log it to save this dish." data-bs-custom-class="custom-popover">
            <button  type="button"   disabled  className="bg-transparent p-0 m-0 transparent-btn" ><i className={`fa-${ auth.favoriteDishes?.includes(dish.id) ? "solid":'regular'} fa-star fa-xl`} style={{color: '#ffc800'}}></i></button>
          </span>
        )}
      </div>

      <div className="d-flex  flex-column flex-grow-1 justify-content-between gap-3">
        <h3 className="card-name text-white">{dish.name} ({dish.portions + (dish.portions > 1 ? " portions" : " portion")})</h3>
        <div>
          <p className="fw-bold my-1 text-white">Nutrition value for  100g: </p>
          <p className="text-white">Calories: {dish.calories_100}, Protein: {dish.protein_100}, Carbs: {dish.carbs_100}, Fats: {dish.fat_100}, Fiber: {dish.fiber_100}, Sugars: {dish.sugars_100}, Caffeine: {dish.caffeine_100}</p>
        </div>

        <Button text="See more about dish" variant="link" className="ms-auto" onClick={() => navigate(`/dish/${dish.id}`)} />
          
        <div className="d-flex justify-content-center gap-2">
          <Button text="Edit dish" variant="edit" onClick={() => setEditDish(dish)} data-bs-toggle="modal" data-bs-target="#modalEditDish" disabled={auth.user?.id != dish.user}/>
          <Button text="Delete dish" variant="delete" onClick={() => handleDeleteDish(dish.id ?? '')} disabled={auth.user?.id != dish.user}/>
        </div>
      </div>
    </div>
  );
};

export default CustomDishCard;
