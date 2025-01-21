import { useQuery } from "@tanstack/react-query";
import { useState } from "react"; 
import { fetchDishes, fetchDishIngredients } from "../utils/caloriesCounter";
import { usePopDish, usePopIngredient, usePutDish, usePutIngredient, useSetIngredient } from "../hooks/caloriesCounter";
import { Dish, Ingredient } from "./interfaces";
import DishForm from "./dishForm";
import IngredientForm from "./ingredientForm";
import { useNavigate } from "react-router-dom";
import '../../styles/style.css';
import '../index.css' 
import 'bootstrap-icons/font/bootstrap-icons.css';


const Dishes: React.FC = () => {
  console.log('back to dishes')
  const {
    status, error, isLoading, refetch, data: dishesRaw
  } = useQuery({
      queryKey: ['dishes'], 
      queryFn: () =>fetchDishes(), 
  });

  const dishes = dishesRaw?.filter(dish => dish.product == null)

  const {
    status: statusIngredients, error: errorIngredients, isLoading: isLoadingIngredients, data: dishIngredients
  } = useQuery({
      queryKey: ['dishIngredients'], 
      queryFn: () =>fetchDishIngredients(), 
  });
  
  const [dishName, setDishName] = useState<{name: string, id: number}>({name: '', id: 0})
  const [dishPortions, setDishPortion] = useState<string | null>()
  const [editDishPortions, setEditDishPortions] = useState(false)
  const [validatePortions, setValidatePortions] = useState<string| null> (null)
  const [editIngredient, setEditIngredient] = useState(false)
  const [editIngredientId, setEditIngredientId] = useState<number>(0) 
  const [createIngredient, setCreateIngredient] = useState<number| null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('');  
  const [showIngredients, setShowIngredients] = useState<number | null>(null)
  const [editDish, setEditDish] = useState<Dish | null>(null)
  const navigate = useNavigate()
  const [isChecked, setIsChecked] = useState(false);

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

 

	const handleEditDish = (dish:Dish) => {
    const formData = new FormData()
    formData.append('calories', dish.calories.toString())
    formData.append('protein', dish.protein.toString())
    formData.append('name', dish.name.slice(0,1).toUpperCase() + dish.name.slice(1))
    formData.append('carbohydrate', dish.carbohydrate.toString())
    formData.append('fat', dish.fat.toString())
    formData.append('calories_100', dish.calories_100.toString())
    formData.append('protein_100', dish.protein_100.toString())
    formData.append('carbohydrate_100', dish.carbohydrate_100.toString())
    formData.append('fat_100', dish.fat_100.toString())
    formData.append('weight', dish.weight.toString())
    formData.append('drink', String(false))
    formData.append('portion', dish.portion.toString())
    formData.append('portions', dish.portions.toString())
    formData.append('type', dish.type)

    console.log(dishPortions, 'portions')
    if (dishName.name != '') {
      formData.append('name', dishName.name.slice(0,1).toUpperCase() + dishName.name.slice(1))

      putDish({dish: formData, id: dish.id})
      refetch()
      setDishName({name: '', id: 0})  
    } else if (dishPortions) {
      console.log(dish, 'dish')

      const dishPortionNumber = Number(dishPortions);
      if (dishPortionNumber > 0 && !isNaN(dishPortionNumber)) {
        console.log(dish, 'dish without name')
        formData.append('portions', dishPortionNumber.toString())
        formData.append('portion', (Math.round(dish.weight / dishPortionNumber)).toString())
        setValidatePortions(null)
        setDishPortion(null)
        setEditDishPortions(false)
  
        putDish({dish: formData, id: dish.id})
        refetch()    
      } else {
        setValidatePortions('Portions should be a positive number')
      }
    }
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
  console.log(filteredDishes?.length, 'filtered dishes')
  console.log(dishIngredients?.length, 'dishIngredients')

  if (isLoading) return <h1>Loading...</h1>;
  if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;

  if (isLoadingIngredients) return <h1>Loading...</h1>;
  if (statusIngredients === 'error') return <h1>{JSON.stringify(errorIngredients)}</h1>;
 
  return (
		<div className="bg-dark text-secondary " > 
      <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Diary</button>
      <button className="btn btn-primary" onClick={() => navigate('/products')}>Products</button>
      <h2>Dishes</h2>
      <button className="btn btn-primary"  data-bs-toggle='modal' data-bs-target='#modalDish'>Create dish</button>
      <div className=' modal fade  form p-2 m-2 ' id='modalDish'> 
        <div className='  modal-dialog modal-dialog-centered' >
          <div className='bg-secondary text-black modal-content'>
            <h3 className='modal-header'>Create new dish</h3>
            <DishForm />
          </div>
        </div>
      </div>

      <div className=' modal fade  form p-2 m-2 ' id='modalEditDish'> 
        <div className='  modal-dialog modal-dialog-centered' >
          <div className='bg-secondary text-black modal-content'>
            <h3 className='modal-header'>Edit dish</h3>
            {editDish && (
              <DishForm  onSuccess={() => setEditDish(null)}  onCancel={() => setEditDish(null)} dishToEdit={editDish}/>
            )}
          </div>
        </div>
      </div>




      <br/>
      <input type="text" placeholder="Search dishes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
      <br />
      <div className="form-check form-switch ms-3">
        <label className="form-check-label">
          Show for one portion
          <input className="form-check-input" type="checkbox" checked={isChecked} onChange={(event) => setIsChecked(event.target.checked)}/>
        </label>
      </div>

      <ul className="list-unstyled">
        {filteredDishes?.length === 0 && dishes?.length !=0 ? (
            <p>No dish match your search.</p>
        ) : (
          filteredDishes?.map((dish, index) => (
            <li key={index} className="bg-light border rounded m-2 p-4">
              <h3>{dish.name} {dish.type=='own'?  '(' + dish.portions + ((dish.portions > 1)? ' portions': ' portion') + ')' : ''}</h3>

              {dishName.id == dish.id ? (
                <div>
                  <input type="text" value={dishName.name} onChange={(e) => setDishName({name: e.target.value.slice(0,1).toUpperCase() + e.target.value.slice(1), id: dish.id})}/>
                  <button  onClick={() => handleEditDish(dish)}>Save Dish Name</button>
                  <button className="btn btn-danger" onClick={() => setDishName({name: '', id: 0 })} >Cancel</button>
                </div>
              ) : (
                <button onClick={() => setDishName({name: dish.name, id: dish.id})}>Edit Dish Name</button>
              )}
              {dish.type == 'own' && (
                <div>
                  <h4>Ingredients:</h4>
                  {showIngredients == dish.id ? (
                    <div>
                      <ul>
                        { dishIngredients[dish.id]?.map((ingredient: Ingredient) => (
                          <li className="d-flex gap-1" key={ingredient.id}>
                            <p>{ingredient.name} {ingredient.weight} g </p>
                            <p>{ingredient.weight} g </p>
                            <p>ccal: {ingredient.calories}, p: {ingredient.protein}, c: {ingredient.carbohydrate}, f: {ingredient.fat}</p>

                            <div>
                              <button  onClick={() => openEditIngredient(ingredient.id ?? 0)}>
                              <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button  onClick={() => handleDeleteIngredient(ingredient.id ?? 0)}>
                              <i className="bi bi-trash-fill"></i>
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
                      {editDishPortions  ? (
                      <div>
                        <input type="text" value={dishPortions ?? '0'}onChange={(e) => setDishPortion(e.target.value)}/>
                        <button onClick={() => handleEditDish(dish)}>Save Dish portions</button>
                        {validatePortions && <p style={{color: 'red'}}>{validatePortions}</p>}
                      </div>
                      ) : (
                          <button onClick={() => {setDishPortion(String(dish.portions)); setEditDishPortions(true)}}>Edit Dish portions</button>
                      )}
                      <br/>
                      <button onClick={() => setShowIngredients(null)}>Cancel</button>
                    </div>

                  ): (
                    <div>
                      <p>{dishIngredients[dish.id] && dishIngredients[dish.id].map((ingredient: Ingredient) => `${ingredient.name}: ${ingredient.weight}g`).join(", ")}.</p>
                      <button onClick={() => setShowIngredients(dish.id)}>Edit dish</button>
                    </div>
                  )}

                  {isChecked ? (
                    <div>
                      <p>For 1 portion ({dish.portion} g): </p>
                      Calories: {Math.round(dish.calories_100*dish.portion/100)}, Protein: {Math.round(dish.protein_100*dish.portion/100)}, Carbohydrates: {Math.round(dish.carbohydrate_100*dish.portion/100)}, Fats: {Math.round(dish.fat_100*dish.portion/100)}
                    </div>
                  ): (
                    <div>
                      <p>Total:</p>
                      Calories: {dish.calories}, Protein: {dish.protein}, Carbohydrates: {dish.carbohydrate}, Fats: {dish.fat}, Weight: {dish.weight}
                    </div>

                  )}


                </div>
              )}

              {dish.type == 'bought' && (
                <div>   
                  {isChecked ? (
                    <div>
                      <p>For 1 portion ({dish.portion} g): </p>
                      Calories: {Math.round(dish.calories_100*dish.portion /100)}, Protein: {Math.round(dish.protein*dish.portion/100)}, Carbohydrates: {Math.round(dish.carbohydrate_100*dish.portion/100)}, Fats: {Math.round(dish.fat_100*dish.portion/100)}
                    </div>
                  ): (
                    <div>
                      <p>For 100 g:</p>
                      Calories: {dish.calories_100}, Protein: {dish.protein_100}, Carbohydrates: {dish.carbohydrate_100}, Fats: {dish.fat_100}  
                    </div>
                  )}
                  <br/>
                  <button onClick={() => setEditDish(dish)}  data-bs-toggle='modal' data-bs-target='#modalEditDish' >Edit dish</button>

                </div>
              )}


              <button onClick={() => handleDeleteDish(dish.id?? 0)}>Delete Dish</button>
            </li>
          ))
        )}
      </ul>
 		</div>
  
  

  );
}

export default Dishes;