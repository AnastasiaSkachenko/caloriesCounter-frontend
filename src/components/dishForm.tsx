import { useQuery } from '@tanstack/react-query';
import React, { useState, useRef, RefObject, useEffect } from 'react';
import { Dish, Ingredient } from './interfaces';
import { fetchDishes, fetchDishIngredients } from '../utils/caloriesCounter';
import { useSetDish, useSetIngredient } from '../hooks/caloriesCounter';
import IngredientForm from './ingredientForm';



interface AddDishProps { 
  onSuccess?: () => void,
  onSuccessEdit?: (modifiedDish: Dish) => void,
  onCancel?: () => void; 
  dishToEdit?: Dish
}

const DishForm: React.FC<AddDishProps> = ({onSuccess,onSuccessEdit, onCancel, dishToEdit}) => {
  const {
    status, error, isLoading,data: dishes
  } = useQuery({
      queryKey: ['dishes'], 
      queryFn: () => fetchDishes()
  });

  const {
    refetch
  } = useQuery({
      queryKey: ['dishIngredients'], 
      queryFn: () => fetchDishIngredients()
  });

  const dishNames: string[] = []
  dishes?.map((dish: Dish) => {
    dishNames.push(dish.name)
  })

   
  const [dishInfo, setDishInfo] = useState<Dish>(dishToEdit ??{
    id: 0,
    name: '', 
    calories: 0,
    calories_100: 0,
    protein: 0,
    carbohydrate: 0,
    fat: 0,
    protein_100: 0,
    carbohydrate_100: 0,
    fat_100: 0,
    weight: 0,
    drink: false, 
    portion: 0,
    portions: 1,
    type: 'own'
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
    

    const handleDishChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'name'| 'image' | 'drink') => {
      setSuccessMessage(null)
      const newValue = e.target.value;
      if (field == 'name') {
        setDishInfo((prevDish) => ({ ...prevDish, [field]: newValue.slice(0,1).toUpperCase() + newValue.slice(1) })); 
      } else {
        setDishInfo((prevDish) => ({ ...prevDish, [field]: newValue })); 
      }
       
      if (newValue === '' && field == 'name') {
        setValidationError('Dish should have a name');
        return
      } else if (field == 'name' && dishNames.includes(newValue.toLowerCase())) {
        setValidationError('Dish with this name already exists');

      }  else {
        setValidationError(null); 
      }
    };

  const handleDishInfoChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'calories_100'| 'protein_100' | 'carbohydrate_100' | 'fat_100'|  'portions' | 'type') => {
    setSuccessMessage(null)
    const newValue = e.target.value;
    if (field == 'portions') {
      setDishInfo((prevDish) => ({ ...prevDish, [field]: Number(newValue) })); 
    } else {
      setDishInfo((prevDish) => ({ ...prevDish, [field]: newValue })); 

    }
      
  };

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList
    }
    setDishInfo((prevFormSate) => ({...prevFormSate, image: target.files[0]}))
    console.log(dishInfo)
  }


    
  useEffect(() => {
    const recalculateDishInfo = (ingredients: Ingredient[]) => {
        const weight = ingredients.reduce((acc, ingredient) => acc + ingredient.weight, 0)
        const calories = ingredients.reduce((acc, ingredient) => acc + ingredient.calories, 0)
        const protein = ingredients.reduce((acc, ingredient) => acc + ingredient.protein, 0)
        const carbohydrate = ingredients.reduce((acc, ingredient) => acc + ingredient.carbohydrate, 0)
        const fat = ingredients.reduce((acc, ingredient) => acc + ingredient.fat, 0)

    setDishInfo((prevDish) => ({...prevDish, weight, calories, protein, carbohydrate, fat}))};

    recalculateDishInfo(ingredients)
  }, [ingredients])
   

  const handleToggle =  (e: React.ChangeEvent<HTMLInputElement>) =>{
    setDishInfo((prevDish) => ({
      ...prevDish,
      type: e.target.checked ? 'own' : 'bought'
    }))
  }
 
  const addIngredient = (ingredient: Ingredient) => {
    setIngredients((prevIngredients) => ([...prevIngredients, ingredient])); 
 
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

    if (ingredients.length == 0 && dishInfo.type == 'own') {
      setValidationError('Dish should have at least one product')
      return
    }

    if (dishNames?.includes(dishInfo.name.toLowerCase())) {
      setValidationError('Dish with this name already exists.')
      return
    }

    if (dishInfo.type == 'own') {
      dishInfo.portion = Math.round(dishInfo.weight / dishInfo.portions) 
    }

    if (dishToEdit && onSuccessEdit) {
      onSuccessEdit(dishInfo)
      return
    }

    const formData = new FormData()

 
    if (dishInfo.image) formData.append('image', dishInfo.image)
    formData.append('name', dishInfo.name.slice(0,1).toUpperCase() + dishInfo.name.slice(1))
    formData.append('calories', dishInfo.calories.toString())
    formData.append('protein', dishInfo.protein.toString())
    formData.append('carbohydrate', dishInfo.carbohydrate.toString())
    formData.append('fat', dishInfo.fat.toString())
    formData.append('calories_100', dishInfo.calories_100.toString())
    formData.append('protein_100', dishInfo.protein_100.toString())
    formData.append('carbohydrate_100', dishInfo.carbohydrate_100.toString())
    formData.append('fat_100', dishInfo.fat_100.toString())
    formData.append('weight', dishInfo.weight.toString())
    formData.append('drink', String(false))
    formData.append('portion', dishInfo.portion.toString())
    formData.append('portions', dishInfo.portions.toString())
    formData.append('type', dishInfo.type)
    console.log(formData, 'formData')
    

    const dishID:number = await  setDish({dish: formData})

    ingredients.map((ingredient) => {
      ingredient.dish = dishID
      setIngredient({ingredient})
    });
    refetch()

    setSuccessMessage('Dish was successfully created')
    if (onSuccess) {
      onSuccess()
    }
  };
  
  if (isLoading) return <h1>Loading...</h1>;
  if (status === 'error') return <h1>{JSON.stringify(error)}</h1>;


  return (
    <div className=' modal fade  form p-2 m-2 ' id='modalDish'> 
    <div className='  modal-dialog modal-dialog-centered' >
      <div className='bg-secondary text-black modal-content'>
        <h3 className='modal-header'>Create new dish</h3>
        <div className='modal-body'> 
          <label className='form-label create-label'>
            Dish Name:
            <input className='form-control create-input form-control-sm my-2' type="text" ref={inputRefs[0]}  onKeyDown={(e) => handleKeyDown(e)}  value={dishInfo.name} onChange={(e) => handleDishChange(e,'name')} />
          </label>
          <label className='form-label create-label my-2'>
            <input type='file' name='image' accept='image/png, image/jpg, image/jpeg' onChange={(e) => handleImageChange(e)} />
          </label>

          <br/>
          <div className="form-check form-switch ">
            <label className="form-check-label">
              Enter ingredients
              <input className="form-check-input" type="checkbox" checked={dishInfo.type=='own'} onChange={(event) => handleToggle(event)} disabled={dishToEdit? true: false}/>
            </label>
          </div>

    
          {dishInfo.type == 'own' && (
            <div>
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

              <div>
                <label>
                  Portions:
                  <input type="number"
                    value={ dishInfo.portions}
                    ref={inputRefs[1]}
                    onChange={(e) =>
                      handleDishInfoChange(e, 'portions')
                    }
                    onKeyDown={handleKeyDown}
                    onFocus={(e) => e.target.select()}/>
                </label>
              </div>     
              <p>Dish weight: {dishInfo.weight} g</p>
              <p>ccal: {dishInfo.calories}, p: {dishInfo.protein}, c: {dishInfo.carbohydrate}, f: {dishInfo.fat}</p>
          
            </div>
          )}
          {dishInfo.type == 'bought' && (
            <div>

              <label>
                Calories for 100g:
                <input type="number" value={dishInfo.calories_100} ref={inputRefs[2]} onChange={(e) => handleDishInfoChange(e, 'calories_100')} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} />
              </label>
              <br/>


              <label>
                Protein for 100g:
                <input type="number" value={dishInfo.protein_100} ref={inputRefs[3]} onChange={(e) => handleDishInfoChange(e, 'protein_100')} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} />
              </label>
              <br/>

              <label>
                Carbohydrates for 100g:
                <input type="number" value={dishInfo.carbohydrate_100} ref={inputRefs[4]} onChange={(e) => handleDishInfoChange(e, 'carbohydrate_100')} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} />
              </label>
              <br/>

              <label>
                Fat for 100g:
                <input type="number" value={dishInfo.fat_100 } ref={inputRefs[5]} onChange={(e) => handleDishInfoChange(e, 'fat_100')} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()}/>
              </label>
              <br/>

              <label>
                Weight of 1 portion (g):
                <input value={dishInfo.portion} onChange={(e) => setDishInfo((prevDishInfo) => ({...prevDishInfo, portion: Number(e.target.value) }))}/>
              </label>

            </div>
          )}

          {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
          <button onClick={handleSubmit}>Submit Dish</button>
          <button className='btn btn-danger p-2 ' data-bs-dismiss='modal' data-bs-target='#modal' type='button' onClick={onCancel}>Cancel</button>
          {successMessage && <p>{successMessage}</p>}
        </div>
      </div>
    </div>
  </div>

  );
};

export default DishForm; 