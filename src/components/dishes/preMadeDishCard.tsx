import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePopDish } from "../../hooks/caloriesCounter";
import useAuth from "../../hooks/useAuth";
import { Dish } from "../interfaces";
import { useState } from "react";
import { toggleFavorite } from "../../utils/dish";
 
interface PreMadeDishProps {
  dish: Dish;
  setEditDish: (dish: Dish) => void;
}



const PreMadeDishCard: React.FC<PreMadeDishProps> = ({dish, setEditDish}) => {
  const { popDish } = usePopDish()
  const { auth, refreshUser } = useAuth()



  const handleDeleteDish = (id:number) => {
    const response = window.confirm('Are you sure you want to delete this dish?');
    if (response) {
      popDish({ id });
    }
  }
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(dish.favorite);


  

  const mutation = useMutation({
    mutationFn: async () => toggleFavorite(dish.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['dish', dish.id] });
  
      const previousState = isFavorite; // Save previous state
  
      // Optimistic UI update
      setIsFavorite((prev) => !prev);
  
      return { previousState };
    },
    onError: (_error, _newState, context) => {
      // Rollback to previous state if mutation fails
      if (context?.previousState !== undefined) {
        setIsFavorite(context.previousState);
      }
    },
    onSuccess: (updatedFavorite) => {
      // Update UI with actual favorite state from response
      setIsFavorite(updatedFavorite);
      refreshUser()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['dish', dish.id] });
    },
  });
  
  const handleFavoriteToggle = () => {
    mutation.mutate();
  };
 
 
  
  return (
    <div className="bg-light border rounded p-3" style={{ height: '33em'}}>
      <div className="d-flex justify-content-end">
        {dish.id}
        <button onClick={handleFavoriteToggle} disabled={mutation.isPending} className="bg-transparent p-0 m-0"><i className={`fa-${ auth.favoriteDishes?.includes(dish.id) ? "solid":'regular'} fa-star fa-xl`} style={{color: '#ffc800'}}></i></button>
      </div>

      <div className="d-flex justify-content-center mb-2" style={{ height: "12em", overflow: "hidden" }}>
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
      <h3 className="card-name" >{dish.name} </h3>
      <div className=" d-flex align-items-center p-1" style={{height: '8em'}} >
        <div>   
          <div className="mb-4">
            <p className="fw-bold my-0">Macros for one portion ({dish.portion} g):</p>
            Calories: {Math.round(dish.calories_100*dish.portion/100)}, Protein: {Math.round(dish.protein_100*dish.portion/100)}, Carbs: {Math.round(dish.carbohydrate_100*dish.portion/100)}, Fats: {Math.round(dish.fat_100*dish.portion/100)}
          </div>
          <div >
            <p className="fw-bold my-0">Macros for  100g: </p>
            Calories: {dish.calories_100}, Protein: {dish.protein_100}, Carbs: {dish.carbohydrate_100}, Fats: {dish.fat_100}
          </div>
        </div>
      </div>
      <p className="text-secondary mb-0"> {dish.user == auth.user?.id ? 'Own dish': 'Other creator'}</p>


      <div className="d-flex justify-content-center">
        <button className="btn btn-warning" onClick={() => setEditDish(dish)} data-bs-toggle="modal" data-bs-target="#modalEditDish" disabled={auth.user?.id != dish.user}>
          Edit dish
        </button>
        <button className="btn btn-danger" onClick={() => handleDeleteDish(dish.id ?? 0)} disabled={auth.user?.id != dish.user}>Delete Dish</button>
      </div>

    </div>

  )
}

export default PreMadeDishCard