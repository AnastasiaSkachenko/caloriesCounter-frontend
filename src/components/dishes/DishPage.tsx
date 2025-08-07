import  { useEffect, useState }  from "react";
import { Dish, Ingredient } from "../interfaces";
import { usePopDish, useToggleFavorite } from "../../hooks/caloriesCounter";
import useAuth from "../../hooks/useAuth";
import { Popover } from "bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDish } from "../../utils/dish";
import { v4 as uuidv4 } from 'uuid';
import Modal from "../Modal";
import BoughtDishForm from "./PreMadeDishForm";
import OwnDishForm from "./CustomDishForm";
import MediaScroller from "../products/MediaScroller";
import Button from "../../customComponents/Button";




const DishPage = () => {
  const [dish, setDish] = useState<Dish>({
      id: uuidv4(), name: '',  calories: 0, calories_100: 0, protein: 0, carbs: 0,
      fat: 0, protein_100: 0,carbs_100: 0, fat_100: 0, weight: 0,  drink: false, 
      portion: 100, portions: 1, type: 'custom', description: '', user: 0,
      weight_of_ready_product: 0, favorite: false, fiber: 0, fiber_100: 0, sugars: 0, sugars_100: 0, caffeine: 0, caffeine_100: 0
    })
  const { popDish } = usePopDish()
  const { id } = useParams<{ id: string }>();
  const { auth } = useAuth()
  const [editDish, setEditDish] = useState<boolean>(false)
  const [refresh, setRefresh] = useState(false)
  const navigate = useNavigate()


  useEffect(() => {
    if (!auth.user) {
      const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
      popoverTriggerList.forEach((popoverTriggerEl) => {
        new Popover(popoverTriggerEl);
      });
    }

  }, [auth.user]);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts

    const fetchCurrentDish = async () => {
      if (!id) return;

      try {
        const dishData = await fetchDish(id);
        console.log(dishData, "dishData");

        if (!isMounted) return; // Prevent state updates if unmounted

        if (!dishData) {
          navigate('/dishes');
          return;
        }

        setDish(dishData);
        setRefresh(false); // Reset after fetching
      } catch (error) {
        console.error("Failed to fetch dish:", error);
        if (isMounted) navigate('/dishes');
      }
    };

    fetchCurrentDish();

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [id, refresh, navigate]);
  
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
    navigate("/dishes")
  }

 
  return (
    <div className="bg-dark min-vh-100 pt-5">
      <Modal id="modalEditDish" title={ dish.type == 'custom' ? "Edit a Pre-made Dish" : 'Edit custom dish'}>
        {dish.type == 'pre_made' ? (
          <BoughtDishForm  onSuccess={() => {setEditDish(false); setRefresh(true)}}  onCancel={() => {setEditDish(false); setRefresh(true)}}  dishToEdit={dish}/>
        ): editDish && (
          <OwnDishForm onSuccess={() => {setEditDish(false); setRefresh(true)}}  onCancel={() => {setEditDish(false); setRefresh(true)}}   dishToEdit={dish} ingredientsData={dish.ingredients} />
        )}
      </Modal>

      <div className="mx-auto pt-5" style={{maxWidth: 1000}} >
        <div className="d-flex flex-column bg-light border rounded p-3">
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

          <h3 className="text-center text-white"  >{dish.name} ({dish.portions + (dish.portions > 1 ? " portions" : " portion")})</h3>


          <MediaScroller name={dish.name} media={dish.media} bg="dark" width={950} height={350} />

          <div className="d-flex  flex-column flex-grow-1 justify-content-between gap-3 mt-4 px-4">
            <div className=" d-flex align-items-around flex-column">   
              <div >
                <p className="fw-bold my-1 text-white">Macros for  1 portion ({dish.portion} g): </p>
                <p className="text-white">Calories: {Math.round(dish.calories_100*dish.portion /100)}, Protein: {Math.round(dish.protein_100*dish.portion/100)}, Carbs: {Math.round(dish.carbs_100*dish.portion/100)}, Fats: {Math.round(dish.fat_100*dish.portion/100)}, Fiber: {Math.round(dish.fiber_100*dish.portion/100)}, Sugars: {Math.round(dish.sugars_100*dish.portion/100)}, Caffeine: {Math.round(dish.caffeine*dish.portion/100)}</p>
              </div>
              <div>
                <p className="fw-bold my-1 text-white">Nutrition value for  100g: </p>
                <p className="text-white">Calories: {dish.calories_100}, Protein: {dish.protein_100}, Carbs: {dish.carbs_100}, Fats: {dish.fat_100}, Fiber: {dish.fiber_100}, Sugars: {dish.sugars_100}, Caffeine: {dish.caffeine_100}</p>
              </div>
              {dish.type == "custom" && (
                <>
                  <div className="d-flex align-items-center " style={{maxHeight: '5em'}}>
                    <div>
                      <p className="text-white my-0"> <b>Ingredients: </b>
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
                  <div>
                    <p className="fw-bold my-1 text-white">Macros for total:</p>
                    <p className="text-white">Calories: {dish.calories}, Protein: {dish.protein}, Carbs: {dish.carbs}, Fats: {dish.fat}, Fiber: {dish.fiber}, Sugars: {dish.sugars}, Caffeine: {dish.caffeine}</p>
                  </div>
                </>
              )}
              {dish.description.length > 0 && (
                <div className="d-flex align-items-center" style={{ maxHeight: '17em', width: '100%', overflow: 'hidden' }}>
                  <div style={{ overflowY: 'auto', height: '100%' }}>
                    <p   style={{ overflowWrap: 'break-word', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                      <b>Instructions:</b> {dish.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="d-flex justify-content-center gap-2">
              <Button text="Edit dish" variant="edit" onClick={() => setEditDish(true)} data-bs-toggle="modal" data-bs-target="#modalEditDish" disabled={auth.user?.id != dish.user}/>
              <Button text="Delete dish" variant="delete" onClick={() => handleDeleteDish(dish.id ?? '')} disabled={auth.user?.id != dish.user}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishPage;
