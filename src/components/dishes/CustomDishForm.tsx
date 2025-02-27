import React, { useState, useRef, useEffect } from 'react';
import { Dish, DishFormProps, Ingredient } from '../interfaces';
import { usePopIngredient, usePutDish, useSetDish, useSetIngredient } from '../../hooks/caloriesCounter';
import IngredientForm from '../ingredients/ingredientForm';
import useAuth from '../../hooks/useAuth';
import { CustomDishSchema } from '../../utils/validation schemes';


const CustomDishForm: React.FC<DishFormProps> = ({onSuccess,onCancel, dishToEdit, ingredientsData}) => {
  const { auth } = useAuth()
  const [dishInfo, setDishInfo] = useState<Dish>( dishToEdit ?? {
    id: 0, name: '',  calories: 0, calories_100: 0, protein: 0, carbohydrate: 0,
    fat: 0, protein_100: 0,carbohydrate_100: 0, fat_100: 0, weight: 0,  drink: false, 
    portion: 100,portions: 1, type: 'custom', image: '', description: '', user: 0
  });
  const [ingredients, setIngredients] = useState<Ingredient[]>(ingredientsData ?? []); 
  const [validation, setValidation] = useState<{message: string | undefined, valid: boolean}>({message: undefined, valid: false})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [ingredientEdit, setIngredientEdit] = useState<Ingredient|null>(null) 
  const [editIndex, setEditIndex] = useState<number| null>(null)
  const [createIngredient, setCreateIngredient] = useState<boolean>(false) 
  const addDishButtonRef = useRef<HTMLButtonElement>(null);



  
  const { setDish } = useSetDish()
  const { setIngredient } = useSetIngredient()
  const { putDish } = usePutDish()
  const { popIngredient } = usePopIngredient()

  useEffect(() => {
    if (dishToEdit && ingredientsData) {
      setDishInfo(dishToEdit);
      setIngredients(ingredientsData)

    }
  }, [dishToEdit, ingredientsData]);


    useEffect(() => {
      if (ingredients.length == 0) {
        // If currentProduct is undefined, set the validation state accordingly
        setValidation({ valid: false, message: 'Dish should have at least one ingredient.' });
        return;
      }
    
      // Proceed with IngredientSchema validation if currentProduct is defined
      CustomDishSchema.validate(dishInfo)
        .then(() => setValidation({ valid: true, message: undefined }))
        .catch((err) => setValidation({ valid: false, message: err.message }));
    }, [dishInfo, ingredients]);    

  const inputRefs = {
    nameRef: useRef<HTMLInputElement>(null),
    descriptionRef: useRef<HTMLTextAreaElement>(null),
    portionRef: useRef<HTMLInputElement>(null),
  };
  
  useEffect(() => {
    const modalElement = document.getElementById(dishToEdit ? 'modalEditDish' : 'modalDishOwn');
    modalElement?.addEventListener('shown.bs.modal', () => {
      if (inputRefs.nameRef.current) {
        inputRefs.nameRef.current.focus();
      }
    });
  
    return () => {
      modalElement?.removeEventListener('shown.bs.modal', () => {
        if (inputRefs.nameRef.current) {
          inputRefs.nameRef.current.focus();
        }
      });
    };
  }, [dishToEdit, inputRefs.nameRef]);
      
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, next?: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
  
      if (next) {
        // Use the next string value to determine the next ref
        const nextRef = inputRefs[next as keyof typeof inputRefs]?.current;
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

  const handleDishChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'name'| 'image' | 'drink' | 'portions' | 'type' | 'description') => {
    setSuccessMessage(null)
    const newValue = e.target.value;
    if (field == 'name') {
      setDishInfo((prevDish) => ({ ...prevDish, [field]: newValue.slice(0,1).toUpperCase() + newValue.slice(1) })); 
    } else if (field == 'portions' && Number(newValue) > 0) {
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
    console.log(ingredient)
    if (dishToEdit) {
      ingredient.dish = dishToEdit.id
    }
    setIngredients((prevIngredients) => ([ ingredient, ...prevIngredients])); 
    setCreateIngredient(false)
  };
   
  const editIngredient = (updatedIngredient: Ingredient, index: number) => {
    setIngredientEdit(null);
  
    setIngredients((prevIngredients) => {
      const updatedIngredients = [...prevIngredients];
  
      if (index >= 0 && index < updatedIngredients.length) {
        // Update existing ingredient at the given index
        updatedIngredients[index] = updatedIngredient;
      } else {
        // If the index is invalid, add it as a new ingredient
        updatedIngredients.push(updatedIngredient);
      }
  
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

  const recalculateMacros = () => {
    if (!dishInfo.portions) {
      dishInfo.portion = 100
      dishInfo.portions = 1
    }
    dishInfo.portion = dishInfo.portions ?  Math.round(dishInfo.weight / dishInfo.portions) : 1
    dishInfo.calories_100 = Math.round(dishInfo.calories / dishInfo.weight * 100)
    dishInfo.protein_100 = Math.round(dishInfo.protein / dishInfo.weight * 100)
    dishInfo.carbohydrate_100 = Math.round(dishInfo.carbohydrate / dishInfo.weight * 100)
    dishInfo.fat_100 = Math.round(dishInfo.fat / dishInfo.weight * 100)
  }

  const handleSubmit = async () => { 
    recalculateMacros()
    const formData = new FormData()

    if (dishInfo.image instanceof File) formData.append('image', dishInfo.image)

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    Object.entries(dishInfo).forEach(([key, value]) => {
      if (key === "name") {
        formData.append(key, capitalize(value as string));
      } if (key === "user" ) {
        formData.append(key, (auth.user?.id ?? 0).toString());
      } else if (key != "product" && key != "image"){
        formData.append(key, value.toString());
      }
    });

    if (dishToEdit) {
      putDish({dish:formData, id: dishInfo.id})
      const newIngredients = ingredients.filter(ingredient => !ingredientsData?.includes(ingredient))
      await Promise.all(
        newIngredients.map((ingredient) => {
          ingredient.dish = dishInfo.id;
          return setIngredient({ ingredient }); // Ensure each update is awaited
        })
      );

      const ingredientsToDelete = ingredientsData?.filter(ingredient => !ingredients.includes(ingredient));

      // Delete ingredients that are no longer present
      if (ingredientsToDelete) {
        await Promise.all(
          ingredientsToDelete.map((ingredient) => {
            return popIngredient({id:ingredient.id}); // Assuming you have a deleteIngredient function
          })
    );  
      }
    } else {
      const dishID = await setDish({dish: formData})

      ingredients.map((ingredient) => {
        console.log(dishID)
        ingredient.dish = dishID
        setIngredient({ingredient})
      });

      console.log(ingredients, 'when submiting')
    }  
  
    setDishInfo({
      id: 0, name: '',  calories: 0, calories_100: 0, protein: 0, carbohydrate: 0,
      fat: 0, protein_100: 0,carbohydrate_100: 0, fat_100: 0, weight: 0,  drink: false, 
      portion: 100,portions: 1, type: 'custom', image: '', description: '', user: 0
    })
    setValidation({message: undefined, valid: false})
    setIngredients([])

 
    if (onSuccess) {
      onSuccess()
    }

  };

  const handleCancel = () => {
    setDishInfo({
      id: 0, name: '',  calories: 0, calories_100: 0, protein: 0, carbohydrate: 0,
      fat: 0, protein_100: 0,carbohydrate_100: 0, fat_100: 0, weight: 0,  drink: false, 
      portion: 100,portions: 1, type: 'custom', image: '', description: '', user: 0
    })
    setValidation({message: undefined, valid:false})
    setIngredients([])

    if (onCancel) onCancel()
  }
  
  return (
    <div className='modal-body pt-0 p-4'> 
      <label className='form-label full-length-label'>
        Dish Name:
        <input className='form-control full-length-input form-control-sm my-2' type="text" ref={inputRefs.nameRef}  onKeyDown={(e) => handleKeyDown(e, 'descriptionRef')}  value={dishInfo.name} onChange={(e) => handleDishChange(e,'name')} />
      </label>

      <label className='form-label full-length-label my-2'> 
        <input className='form-control form-control-file bg-secondary text-white' type='file' name='image' accept='image/png, image/jpg, image/jpeg' onChange={(e) => handleImageChange(e)} />
      </label>

      <label className="form-check form-switch">
        <input className="form-check-input" type="checkbox" role="switch" checked={dishInfo.drink}
          onChange={(e) => setDishInfo((prevDish) => ({...prevDish, drink: e.target.checked}))}/>
        {dishInfo.drink ? " Drink" : " Dish"}
      </label>

      <label className='form-label full-length-label'>
        Description:
        <textarea className='form-control full-length-input form-control-sm my-2' value={dishInfo.description} ref={inputRefs.descriptionRef} onChange={(e) => handleDishChange(e, 'description')} onKeyDown={(e) => handleKeyDown(e, 'portionRef')} onFocus={(e) => e.target.select()} />
      </label>


      {createIngredient ? (
        <IngredientForm onSuccess={(TCProduct) => addIngredient(TCProduct)} onCancel={() => setCreateIngredient(false)} />
      ) : (
        <div className='d-flex justify-content-center'>
          <button className='btn btn-primary' onClick={() => setCreateIngredient(true)}>Add ingredient</button>
        </div>
      )}
      {ingredients.map((product, index) => (
        <div  key={index}>
          <hr/>
          <div className='d-flex justify-content-between align-items-center '>
            <span className='fw-bold'>{product.name} <span className='text-danger fw-light'>{!product.product && 'This product was deleted by creator, you can no longer modify this ingredient.'}</span></span>
            <div className='d-flex justify-content-center'>
              <button className='btn btn-primary' onClick={() => handleEditIngredient(index)} disabled={!product.product}>Edit</button>
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
          <input className='border border-light rounded p-2 mx-2' type="number" value={ dishInfo.portions} ref={inputRefs.portionRef} onChange={(e) => handleDishChange(e, 'portions')}onKeyDown={handleKeyDown} onFocus={(e) => e.target.select()}/>
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