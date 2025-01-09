import { useQuery } from "@tanstack/react-query";
import { useState } from "react"; 
import { fetchDishes, fetchDishIngredients } from "../utils/caloriesCounter";
import { usePopDish, usePopIngredient, usePutDish, usePutIngredient, useSetIngredient } from "../hooks/caloriesCounter";
import { Dish, Ingredient } from "./interfaces";
import DishForm from "./dishForm";
import IngredientForm from "./ingredientForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/dish.css'

 
 

const Dishes: React.FC = () => {
  const {
    status, error, isLoading, refetch, data: dishesRaw
  } = useQuery({
      queryKey: ['dishes'], 
      queryFn: () =>fetchDishes(), 
  });

  const dishes = dishesRaw?.filter(dish => dish.product == null)

  const {
    status: statusIngredients, error: errorIngredients, isLoading: isLoadingIngredients,  data: dishIngredients
  } = useQuery({
      queryKey: ['dishIngredients'], 
      queryFn: () =>fetchDishIngredients(), 
  });


 
  const [createDish, setCreateDish] = useState(false)
  const [dishName, setDishName] = useState<string>('')
  const [editIngredient, setEditIngredient] = useState(false)
  const [editIngredientId, setEditIngredientId] = useState<number>(0) 
  const [createIngredient, setCreateIngredient] = useState<number| null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('');  

  const { putDish } = usePutDish()
  const { putIngredient } = usePutIngredient()
  const { setIngredient } = useSetIngredient()
  const { popIngredient } = usePopIngredient()
  const { popDish } = usePopDish() 

 
	const filteredDishes = searchQuery
    ? dishes?.filter(dish =>
        dish.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    : dishes?.slice().reverse();

 
	const openEdit = (name:string) => {
		setDishName(name) 
	}

	const handleEditDish = (dish:Dish) => {
      dish.name = dishName
      putDish({dish})
      refetch()
      setDishName('')
	}

	const handleNewIngredient = async (ingredient: Ingredient, dishId:number) => {
      const updatedIngredient = {
        ...ingredient,
        dish: dishId,   
      };

      if (updatedIngredient) {
        setIngredient({ ingredient: updatedIngredient});
      }
      refetch()
      setCreateIngredient(null)
  }

	const openEditIngredient = (id:number) => {
 
		setEditIngredient(true)
		setEditIngredientId(id) 
	}

 

  const handleEditIngredient = async (ingredient: Ingredient) => { 
    putIngredient({ ingredient})
    
    await refetch()
    setEditIngredient(false)
  };

  const handleDeleteIngredient = (IngredientId: number) => {
      popIngredient({id:IngredientId})
      refetch()
  }

  const handleDeleteDish = (id:number) => {
    const response = window.confirm('Are you sure you want to delete this dish?');
    if (response) {
      popDish({ id });
    }
    refetch();
  }

  if (isLoading) return <h1>Loading...</h1>;
  if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;

  if (isLoadingIngredients) return <h1>Loading...</h1>;
  if (statusIngredients === 'error') return <h1>{JSON.stringify(errorIngredients)}</h1>;
 
  return (
		<div className=" dish  "> 
          <h2>Dishes</h2>

      
          {createDish  ? (
            <div className='d-flex justify-content-center'>
              <DishForm onSuccess={() => setCreateDish(false)} onCancel={() => setCreateDish(false)} />
            </div>
          ) : (
              <button onClick={() => setCreateDish(true)}>Create dish</button>
          )}
      
          <br />

          <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />

          <ul>
              {filteredDishes?.length === 0 && dishes?.length !=0 ? (
                  <p>No dish match your search.</p>
              ) : (
                  filteredDishes?.map((dish, index) => (
                      <li key={index}>
                        <h3>Dish Name: {dish.name}</h3>

                        {dishName ? (
                            <div>
                              <input type="text" value={dishName}onChange={(e) => setDishName(e.target.value)}/>
                              <button onClick={() => handleEditDish(dish)}>Save Dish Name</button>
                            </div>
                        ) : (
                            <button onClick={() => openEdit(dish.name)}>Edit Dish Name</button>
                        )}

                        <h4>Ingredients:</h4>
                        <ul>
                          {dishIngredients[dish.id]?.map((ingredient: Ingredient) => (
                            <li className="d-flex gap-1" key={ingredient.id}>
                              <p>{ingredient.name} {ingredient.weight} g </p>
                              <p>{ingredient.weight} g </p>
                              <p>ccal: {ingredient.calories}, p: {ingredient.protein}, c: {ingredient.carbohydrate}, f: {ingredient.fat}</p>

                              <div>
                                <button onClick={() => openEditIngredient(ingredient.id ?? 0)}>
                                  Edit Ingredient
                                </button>
                                <button onClick={() => handleDeleteIngredient(ingredient.id ?? 0)}>
                                  Delete Ingredient
                                </button>
                              </div>
                      
                              {editIngredient && editIngredientId === ingredient.id && (
                                <IngredientForm
                                  onSuccess={(Ingredient) => handleEditIngredient(Ingredient)}
                                  onCancel={() => setEditIngredient(false)}
                                  ingredientId={ingredient.id}
                                  ingredients={dishIngredients[dish.id].filter((ingredientt: Ingredient) => ingredientt.id !== ingredient.id) ?? []} 
                                />
                              )}
                            </li>
                          ))}

                          {createIngredient== dish.id ? (
                              <IngredientForm
                                  onSuccess={(dishProduct) => handleNewIngredient(dishProduct, dish.id)}
                                  onCancel={() => setCreateIngredient(null)}
                                  ingredients={dishIngredients[dish.id]?? []}
                              />
                          ) : (
                              <button onClick={() => setCreateIngredient(dish.id)}>Add new ingredient</button>
                          )}
                        </ul>

                        <p>Dish weight: {dish.weight} g</p>
                        <p>for 100g: ccal: {dish.calories_100}, p: {dish.protein_100}, c: {dish.carbohydrate_100}, f: {dish.fat_100} </p>
                        <p>ccal: {dish.calories}, p: {dish.protein}, c: {dish.carbohydrate}, f: {dish.fat}</p>
                        <button onClick={() => handleDeleteDish(dish.id?? 0)}>Delete Dish</button>
                      </li>
                  ))
              )}
          </ul>
 		</div>

  );
}

export default Dishes;