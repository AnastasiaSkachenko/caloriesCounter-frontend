import { useQuery } from '@tanstack/react-query';
import React, { useState, useRef, RefObject, useEffect } from 'react';
import { Dish, Ingredient } from './interfaces';
import { fetchDishes } from '../utils/caloriesCounter';
import { useSetDish, useSetIngredient } from '../hooks/caloriesCounter';
import IngredientForm from './ingredientForm';
import '../styles/dish.css'
import 'bootstrap/dist/css/bootstrap.min.css';



interface AddDishProps { 
  onSuccess: () => void,
  onCancel?: () => void; 
}

const DishForm: React.FC<AddDishProps> = ({onSuccess, onCancel}) => {
  const {
    status, error, isLoading,data: dishes
  } = useQuery({
      queryKey: ['dishes'], 
      queryFn: () => fetchDishes()
  });

  const dishNames: string[] = []
  dishes?.map((dish: Dish) => {
    dishNames.push(dish.name)
  })

   
  const [dishInfo, setDishInfo] = useState<Dish>({
    id: 0,
    name: '',
    image: '',
    calories: 0,
    calories_100: 0,
    protein: 0,
    carbohydrate: 0,
    fat: 0,
    protein_100: 0,
    carbohydrate_100: 0,
    fat_100: 0,
    weight: 0,
    drink: false ,
  });
  const [ingredients, setIngredients] = useState<Ingredient[]>([]); 
  const [validationError, setValidationError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const addProductButtonRef = useRef<HTMLButtonElement>(null);
  const [ingredientEdit, setIngredientEdit] = useState<Ingredient|null>(null) 
  const [editIndex, setEditIndex] = useState<number| null>(null)
  const [createIngredient, setCreateIngredient] = useState<boolean>(false) 
 

 
  const { setDish } = useSetDish()
  const { setIngredient } = useSetIngredient()

 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, next?:RefObject<HTMLInputElement>) => { 
    if (e.key === 'Enter') {
      e.preventDefault(); 

      if (next) {
        const nextRef = next.current; 
        if (nextRef) {
          nextRef.focus();
        }  
      } else {
        if (addProductButtonRef.current) {
          addProductButtonRef.current.click(); 
        }
      }
    }
  };

    const inputRefs = [
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null)
    ];
    

  const handleDishChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'name'| 'image' | 'drink' ,) => {
    setSuccessMessage(null)
    const newValue = e.target.value;
    setDishInfo((prevDish) => ({ ...prevDish, [field]: newValue })); 
     
    if (newValue === '' && field == 'name') {
      setValidationError('Dish should have a name');
      return
    } else {
      setValidationError(null); 
    }
  };

  useEffect(() => {
    const recalculateDishInfo = (ingredients: Ingredient[]) => {
        const weight = ingredients.reduce((acc, ingredient) => acc + ingredient.weight, 0)
        const calories = ingredients.reduce((acc, ingredient) => acc + ingredient.calories, 0)
        const protein = ingredients.reduce((acc, ingredient) => acc + ingredient.protein, 0)
        const carbohydrate = ingredients.reduce((acc, ingredient) => acc + ingredient.carbohydrate, 0)
        const fat = ingredients.reduce((acc, ingredient) => acc + ingredient.fat, 0)
        const calories_100 = Math.round((calories / weight) * 100)

    setDishInfo((prevDish) => ({...prevDish, weight, calories, protein, carbohydrate, fat, calories_100}))};

    recalculateDishInfo(ingredients)
  }, [ingredients])
   
 
  const addIngredient = (ingredient: Ingredient) => {
    setIngredients((prevIngredients) => ([...prevIngredients, ingredient])); 
    console.log('worked')
 
    setCreateIngredient(false)
  };
   
  const editIngredient = (updatedIngredient: Ingredient, index: number) => {
    setIngredientEdit(null)
    setIngredients((prevIngredients) => {
      const updatedIngredients = [...prevIngredients];
      updatedIngredients[index] = updatedIngredient;
      return updatedIngredients;
    });
  };
 
  const handleEditIngredient = (index:number) => {
    setIngredientEdit(ingredients[index]) 
    setEditIndex(index)
  }

  const handleDeleteIngredient = (index: number) => {
    setIngredients(prevIngredients => {
      const updatedProducts = prevIngredients.filter((_, i) => i !== index); 
      return updatedProducts;
    });
  };

  const handleSubmit = async () => {
    if (dishInfo.name === '') {
      setValidationError('Dish should have a name')
      return;
    } else {
      setValidationError(null)
    }

    if (ingredients.length == 0) {
      setValidationError('Dish should have at least one product')
      return
    }

    if (dishNames?.includes(dishInfo.name)) {
      setValidationError('Dish with this name already exists.')
      return
    }

    setDishInfo((prevDish) => ({
        ...prevDish,
        name: prevDish.name.slice(0,1).toUpperCase() + prevDish.name.slice(1)
    }))

  
    const dishID:number = await  setDish({dish:dishInfo})

    ingredients.map((ingredient) => {
      ingredient.dish = dishID
      setIngredient({ingredient})
    });

    setSuccessMessage('Dish was successfully created')
    onSuccess()
  };
  
  if (isLoading) return <h1>Loading...</h1>;
  if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;


  return (
    <div className='d-flex flex-column justify-content-center form'> 
      <h2>Create a new Dish</h2>
      <label>
        Dish Name:
        <input type="text" ref={inputRefs[0]}  onKeyDown={(e) => handleKeyDown(e)}  value={dishInfo.name} onChange={(e) => handleDishChange(e,'name')} />
      </label>
      <br/>
      {createIngredient ? (
        <IngredientForm onSuccess={(TCProduct) => addIngredient(TCProduct)} onCancel={() => setCreateIngredient(false)} ingredients={[]}/>
      ) : (
        <button onClick={() => setCreateIngredient(true)}>Add ingredient</button>
      )}
      { ingredients.map((product, index) => (
        <div key={index}>
          <p>{product.name}</p>
          <p>{product.weight} g</p>
          <p>ccal: {product.calories}, p: {product.protein}, c: {product.carbohydrate}, f: {product.fat}</p>
          <button onClick={() => handleEditIngredient(index)}>Edit</button>
          {ingredientEdit && editIndex == index  && (
            <IngredientForm onSuccess={(TCProduct) => editIngredient(TCProduct, index)} onCancel={() => setIngredientEdit(null)} ingredientData={product} ingredients={ingredients}   />

          )}
          <button onClick={() => handleDeleteIngredient(index)}>Delete</button>
        </div>
      ))}

      <p>Dish weight: {dishInfo.weight} g</p>
      <p>ccal: {dishInfo.calories}, p: {dishInfo.protein}, c: {dishInfo.carbohydrate}, f: {dishInfo.fat}</p>

      {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
      <button onClick={handleSubmit}>Submit Dish</button>
      {onCancel && (
        <button type='button' onClick={onCancel}>Cancel</button>
      )}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default DishForm; 