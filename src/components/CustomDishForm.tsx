import React, { useState, useRef, RefObject, useEffect } from 'react';
import { Dish, DishFormProps, Ingredient } from './interfaces';
import { usePutDish, useSetDish, useSetIngredient } from '../hooks/caloriesCounter';
import IngredientForm from './ingredientForm';
import { useQuery } from '@tanstack/react-query';
import { checkDishExists } from '../utils/caloriesCounter';


const CustomDishForm: React.FC<DishFormProps> = ({onSuccess,onCancel, dishToEdit, ingredientsData}) => {
  const [dishInfo, setDishInfo] = useState<Dish>( dishToEdit ?? {
    id: 0, name: '',  calories: 0, calories_100: 0, protein: 0, carbohydrate: 0,
    fat: 0, protein_100: 0,carbohydrate_100: 0, fat_100: 0, weight: 0,  drink: false, 
    portion: 100,portions: 1, type: 'custom', image: '',
  });
  const [ingredients, setIngredients] = useState<Ingredient[]>(ingredientsData ?? []); 
  const [validation, setValidation] = useState<{message: string | undefined, valid: boolean}>({message: undefined, valid: false})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [ingredientEdit, setIngredientEdit] = useState<Ingredient|null>(null) 
  const [editIndex, setEditIndex] = useState<number| null>(null)
  const [createIngredient, setCreateIngredient] = useState<boolean>(false) 
  const addDishButtonRef = useRef<HTMLButtonElement>(null);
  

  const dishNameExists = useQuery({
    queryKey: ["checkDishExists", dishInfo.name],
    queryFn: () => checkDishExists(dishInfo.name),
    enabled: !!dishInfo.name, // Runs query only when name is provided
  })
  
  const { setDish } = useSetDish()
  const { setIngredient } = useSetIngredient()
  const { putDish } = usePutDish()


  useEffect(() => {
    if (dishToEdit && ingredientsData) {
      setDishInfo(dishToEdit);
      setIngredients(ingredientsData)
    }
  }, [dishToEdit, ingredientsData]);

  useEffect(() => {
    if (dishNameExists.data ) {
      setValidation((prev) => prev.message === 'Dish with this name already exists'
        ? prev 
        : { message: 'Dish with this name already exists', valid: false }
      );
    } else {
      setValidation((prev) => prev.message === undefined 
        ? prev 
        : { message: undefined, valid: true }
      );
    }
  }, [dishNameExists]);
  


  const [inputRefs] = useState([
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]);
  
  useEffect(() => {
    const modalElement = document.getElementById(dishToEdit ? 'modalEditDish' : 'modalDishOwn');
    modalElement?.addEventListener('shown.bs.modal', () => {
      if (inputRefs[0].current) {
        inputRefs[0].current.focus();
      }
    });
  
    return () => {
      modalElement?.removeEventListener('shown.bs.modal', () => {
        if (inputRefs[0].current) {
          inputRefs[0].current.focus();
        }
      });
    };
  }, [inputRefs, dishToEdit]);
      


 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, next?:RefObject<HTMLInputElement>) => { 
    if (e.key === 'Enter') {
      e.preventDefault(); 

      if (next) {
        const nextRef = next.current; 
        if (nextRef) {
          nextRef.focus();
        }  
      } else {
        if (addDishButtonRef.current) {
          addDishButtonRef.current.click(); 
        }
      }
    }
  };

 

  const handleDishChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'name'| 'image' | 'drink' | 'portions' | 'type') => {
    setSuccessMessage(null)
    const newValue = e.target.value;
    if (field == 'name') {
      setDishInfo((prevDish) => ({ ...prevDish, [field]: newValue.slice(0,1).toUpperCase() + newValue.slice(1) })); 
    } else if (field == 'portions') {
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
    console.log(dishInfo)
    dishInfo.portion = Math.round(dishInfo.weight / dishInfo.portions) 
    dishInfo.calories_100 = Math.round(dishInfo.calories / dishInfo.weight * 100)
    dishInfo.protein_100 = Math.round(dishInfo.protein / dishInfo.weight * 100)
    dishInfo.carbohydrate_100 = Math.round(dishInfo.carbohydrate / dishInfo.weight * 100)
    dishInfo.fat_100 = Math.round(dishInfo.fat / dishInfo.weight * 100)
    

    const formData = new FormData()


    if (dishInfo.image instanceof File) formData.append('image', dishInfo.image)

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    Object.entries(dishInfo).forEach(([key, value]) => {
      if (key === "name") {
        formData.append(key, capitalize(value as string));
      } else if (key != "product" && key != "image"){
        formData.append(key, value.toString());
      }
    });

    if (dishToEdit) {
      putDish({dish:formData, id: dishInfo.id})
    } else {
      const dishID:number = await  setDish({dish: formData})

      ingredients.map((ingredient) => {
        ingredient.dish = dishID
        setIngredient({ingredient})
      });
    }  
    
    console.log(dishInfo)
 
    if (onSuccess) {
      onSuccess()
      setDishInfo({
        id: 0, name: '',  calories: 0, calories_100: 0, protein: 0, carbohydrate: 0,
        fat: 0, protein_100: 0,carbohydrate_100: 0, fat_100: 0, weight: 0,  drink: false, 
        portion: 100,portions: 1, type: 'custom', image: ''
      })
      setValidation({message: undefined, valid: false})
      setIngredients([])
    }
    

  };

  const handleCancel = () => {
    setDishInfo({
      id: 0, name: '',  calories: 0, calories_100: 0, protein: 0, carbohydrate: 0,
      fat: 0, protein_100: 0,carbohydrate_100: 0, fat_100: 0, weight: 0,  drink: false, 
      portion: 100,portions: 1, type: 'custom', image: ''
    })
    setValidation({message: undefined, valid:false})
    setIngredients([])

    if (onCancel) onCancel()
  }
  
  return (
    <div className='modal-body pt-0'> 
      <label className='form-label create-label'>
        Dish Name:
        <input className='form-control create-input form-control-sm my-2' type="text" ref={inputRefs[0]}  onKeyDown={(e) => handleKeyDown(e)}  value={dishInfo.name} onChange={(e) => handleDishChange(e,'name')} />
      </label>

      <label className='form-label create-label my-2'> 
        <input className='form-control form-control-file bg-secondary text-white' type='file' name='image' accept='image/png, image/jpg, image/jpeg' onChange={(e) => handleImageChange(e)} />
      </label>

      <label className="form-check form-switch">
        <input className="form-check-input" type="checkbox" role="switch" checked={dishInfo.drink}
          onChange={(e) => setDishInfo((prevDish) => ({...prevDish, drink: e.target.checked}))}/>
        {dishInfo.drink ? " Drink" : " Dish"}
      </label>


      {createIngredient ? (
        <IngredientForm onSuccess={(TCProduct) => addIngredient(TCProduct)} onCancel={() => setCreateIngredient(false)} />
      ) : (
        <div className='d-flex justify-content-center'>
          <button className='btn btn-primary' onClick={() => setCreateIngredient(true)}>Add ingredient</button>
        </div>
      )}
      { ingredients.slice(0).reverse().map((product, index) => (
        <div  key={index}>
          <hr/>
          <div className='d-flex justify-content-between align-items-center '>
            <span className='fw-bold'>{product.name}</span>
            <div className='d-flex justify-content-center'>
              <button className='btn btn-primary' onClick={() => handleEditIngredient(index)}>Edit</button>
              <button className='btn btn-danger' onClick={() => handleDeleteIngredient(index)}>Delete</button>
            </div>
          </div>


          <p>Weight: {product.weight}g, Calories: {product.calories}, Protein: {product.protein}, Carbs: {product.carbohydrate}, Fat: {product.fat}</p>
          {ingredientEdit && editIndex == index  && (
            <IngredientForm onSuccess={(TCProduct) => editIngredient(TCProduct, index)} onCancel={() => setIngredientEdit(null)} ingredientData={product}   />

          )}
        </div>
      ))}
      <hr  />

      <div>
        <label className='d-flex justify-content-between align-items-center mt-2'>
          Portions:
          <input className='border border-light rounded p-2 mx-2' type="number" value={ dishInfo.portions} ref={inputRefs[1]} onChange={(e) => handleDishChange(e, 'portions')}onKeyDown={handleKeyDown} onFocus={(e) => e.target.select()}/>
        </label>
      </div>  
      <hr className='text-white border-2'/>   
      <p>Dish weight: {dishInfo.weight} g</p>
      <p>Calories: {dishInfo.calories}, Protein: {dishInfo.protein}, Carbs: {dishInfo.carbohydrate}, Fat: {dishInfo.fat}</p>
  
  
      
 
      <div className='d-flex justify-content-center'>
        <div className='tooltip-trigger p-0'>
          {!validation.valid && <span className='tooltip'>{validation.message}</span>}
          <button className='btn btn-dark p-2' ref={addDishButtonRef}  onClick={handleSubmit} data-bs-dismiss='modal' data-bs-target='#modalDishOwn' disabled={!validation.valid}>Submit</button>
        </div>

        <button className='btn btn-danger btn-sm p-2' data-bs-dismiss='modal' data-bs-target='#modalDishOwn' type='button' onClick={handleCancel}>Cancel</button>
      </div>
      {successMessage && <p>{successMessage}</p>}
    </div>
 
  );
};

export default CustomDishForm; 