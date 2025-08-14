import React, { useState, useRef, useEffect } from 'react';
import { Dish, DishFormProps, Ingredient } from '../interfaces';
import { usePopIngredient, usePutDish, usePutIngredient, useSetDish, useSetIngredient } from '../../hooks/caloriesCounter';
import IngredientForm from '../ingredients/ingredientForm';
import { useCustomDishSchema } from '../../utils/validationSchemes';
import { convertObjectToFormData, useHandleKeyDown } from '../../utils/utils';
import { v4 as uuidv4 } from 'uuid';
import MediaPicker from '../mediaPicker';
import Button from '../../customComponents/Button';
import useAuth from '../../hooks/useAuth';



const CustomDishForm: React.FC<DishFormProps> = ({onSuccess, onCancel, dishToEdit, ingredientsData}) => {
  const { auth } = useAuth()
  const [form, setForm] = useState<Dish>( dishToEdit || {
      id: uuidv4(), name: '',  calories: 0, calories_100: 0, protein: 0, carbs: 0,
      fat: 0, protein_100: 0,carbs_100: 0, fat_100: 0, weight: 0,  drink: false, 
      portion: 100, portions: 1, type: 'custom', description: '', user: auth.user?.id ?? 0, media_to_delete: [],
      weight_of_ready_product: 0, favorite: false, fiber: 0, fiber_100: 0, sugars: 0, sugars_100: 0, caffeine: 0, caffeine_100: 0
  });
  const [ingredients, setIngredients] = useState<Ingredient[]>(ingredientsData ?? []); 
  const [validation, setValidation] = useState<{message: string | undefined, valid: boolean}>({message: undefined, valid: false})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [ingredientEdit, setIngredientEdit] = useState<Ingredient|null>(null) 
  const [editIndex, setEditIndex] = useState<number| null>(null)
  const [createIngredient, setCreateIngredient] = useState<boolean>(false) 
  const addDishButtonRef = useRef<HTMLButtonElement>(null);
  const description = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (auth.user && !dishToEdit && auth.user.id > 0) {
      setForm(prev => ({
        ...prev,
        user: auth.user?.id ?? 0
      }));
    }
  }, [auth.user, dishToEdit]);
  

  const resetForm = () => {
    setForm({
      id: uuidv4(), name: '',  calories: 0, calories_100: 0, protein: 0, carbs: 0,
      fat: 0, protein_100: 0,carbs_100: 0, fat_100: 0, weight: 0,  drink: false, 
      portion: 100, portions: 1, type: 'custom', media_to_delete: [], description: '', user: auth.user?.id ?? 0,
      weight_of_ready_product: 0, favorite: false, fiber: 0, fiber_100: 0, sugars: 0, sugars_100: 0, caffeine: 0, caffeine_100: 0
    })
  }

  const { setDish } = useSetDish()
  const { setIngredient } = useSetIngredient()
  const { putDish } = usePutDish()
  const { putIngredient } = usePutIngredient()
  const { popIngredient } = usePopIngredient()
  const { handleKeyDown } = useHandleKeyDown()
  const validationScheme = useCustomDishSchema(dishToEdit && dishToEdit.name)


  useEffect(() => {
    if (dishToEdit) {
      setForm(dishToEdit);
    }
    if (ingredientsData) {
      setIngredients(ingredientsData);
    }
  }, [dishToEdit, ingredientsData]);
  

  useEffect(() => {
    if (ingredients.length == 0) {
      // If currentProduct is undefined, set the validation state accordingly
      setValidation({ valid: false, message: 'Dish should have at least one ingredient.' });
      return;
    }
  
    // Proceed with IngredientSchema validation if currentProduct is defined
    validationScheme.validate(form)
      .then(() => setValidation({ valid: true, message: undefined }))
      .catch((err) => setValidation({ valid: false, message: err.message }));
  }, [form, ingredients, dishToEdit, validationScheme]);    

  const [inputRefs] = useState([
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
  }, [dishToEdit, inputRefs]);
      

  const handleDishChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'name'| 'image' | 'drink' | 'portions' | 'type' | 'description' | 'weight_of_ready_product') => {
    setSuccessMessage(null)
    const newValue = e.target.value;
    if (field == 'name') {
      setForm((prevDish) => ({ ...prevDish, [field]: newValue.slice(0,1).toUpperCase() + newValue.slice(1) })); 
    } else if ((field == 'portions' || field == 'weight_of_ready_product') && Number(newValue) > 0) {
      setForm((prevDish) => ({ ...prevDish, [field]: Number(newValue) })); 
    } else {
      setForm((prevDish) => ({ ...prevDish, [field]: newValue })); 
    }
  };


  useEffect(() => {
    const recalculateForm = (ingredients: Ingredient[]) => {
      const weight = ingredients.reduce((acc, ingredient) => acc + ingredient.weight, 0)
      const calories = ingredients.reduce((acc, ingredient) => acc + ingredient.calories, 0)
      const protein = ingredients.reduce((acc, ingredient) => acc + (ingredient.protein ? Number(ingredient.protein) : 0), 0);
      const carbs = ingredients.reduce((acc, ingredient) => acc + (ingredient.carbs ? Number(ingredient.carbs) : 0), 0);
      const fat = ingredients.reduce((acc, ingredient) => acc + (ingredient.fat ? Number(ingredient.fat) : 0), 0);
                         
    setForm((prevDish) => ({...prevDish, weight, weight_of_ready_product: weight, calories, protein:parseFloat(protein.toFixed(1)), carbs:parseFloat(carbs.toFixed(1)), fat:parseFloat(fat.toFixed(1))}))};
    recalculateForm(ingredients)
  }, [ingredients])
   
  const addIngredient = (ingredient: Ingredient) => {
    console.log("add ingredient",ingredient)
    if (dishToEdit) {
      ingredient.dish = dishToEdit.id
    }
    setIngredients((prevIngredients) => ([ ingredient, ...prevIngredients])); 
    setCreateIngredient(false)
  };
   
  const editIngredient = (updatedIngredient: Ingredient, index: number) => {
    setIngredientEdit(null);
    updatedIngredient.edited = true

  
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
    if (!form.portions) {
      form.portion = 100
      form.portions = 1
    }
    const weight = form.weight_of_ready_product ?? form.weight
    form.portion = form.portions ? Math.round(weight / form.portions) : 1;
    form.calories_100 = Math.round(form.calories / weight * 100);
    const protein = ingredients.reduce((acc, ingredient) => acc + (ingredient.protein ? Number(ingredient.protein) : 0), 0);
    const carbs = ingredients.reduce((acc, ingredient) => acc + (ingredient.carbs ? Number(ingredient.carbs) : 0), 0);
    const fat = ingredients.reduce((acc, ingredient) => acc + (ingredient.fat ? Number(ingredient.fat) : 0), 0);

    form.protein_100 = parseFloat((protein / weight * 100).toFixed(1));
    form.carbs_100 = parseFloat((carbs / weight * 100).toFixed(1));
    form.fat_100 = parseFloat((fat / weight * 100).toFixed(1));  }

  const handleSubmit = async () => { 
    recalculateMacros()
    const formData = await convertObjectToFormData(form, "dish")
    console.log("dish form before sending", form)

    if (dishToEdit) {
      // Update dish
      await putDish({ dish: formData, id: form.id });

      // New ingredients (added by the user)
      const newIngredients = ingredients.filter(
        (ingredient) => !ingredientsData?.some((ing) => ing.id === ingredient.id)
      );

      await Promise.all(
        newIngredients.map((ingredient) => {
          ingredient.dish = form.id;
          return setIngredient({ ingredient }); 
        })
      );

      // Edited ingredients (existing ones but with changes)
      const editedIngredients = ingredients.filter((ingredient) => {
        const original = ingredientsData?.find((ing) => ing.id === ingredient.id);
        return (
          original && ingredient.edited
        );
      });

      await Promise.all(
        editedIngredients.map((ingredient) => {
          return putIngredient({ ingredient }); 
        })
      );

      // Deleted ingredients
      const ingredientsToDelete = ingredientsData?.filter(
        (ingredient) => !ingredients.some((ing) => ing.id === ingredient.id)
      );

      if (ingredientsToDelete) {
        await Promise.all(
          ingredientsToDelete.map((ingredient) => popIngredient({ id: ingredient.id }))
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
  
    resetForm()
    setValidation({message: undefined, valid: false})
    setIngredients([])

 
    if (onSuccess) {
      onSuccess()
    }

  };

  const handleCancel = () => {
    resetForm()
    setValidation({message: undefined, valid:false})
    setIngredients([])

    if (onCancel) onCancel()
  }
  
  return (
    <div className='modal-body pt-0 p-4'> 
      <label className='form-label full-length-label'>
        Dish Name:
        <input className='form-control full-length-input form-control-sm my-2' type="text" ref={inputRefs[0]}  onKeyDown={(e) => handleKeyDown(e, description)}  value={form.name ?? ''} onChange={(e) => handleDishChange(e,'name')} />
      </label>

      <MediaPicker media={form.media} mediaChange={(media) => setForm({...form, media})} setMediaToDelete={(media_to_delete) => setForm({...form, media_to_delete})} />

      <label className="form-check form-switch">
        <input className="form-check-input" type="checkbox" role="switch" checked={form.drink}
          onChange={(e) => setForm((prevDish) => ({...prevDish, drink: e.target.checked}))}/>
        {form.drink ? " Drink" : " Dish"}
      </label>

      <label className='form-label full-length-label'>
        Description:
        <textarea className='form-control full-length-input form-control-sm my-2' value={form.description} ref={description} onChange={(e) => handleDishChange(e, 'description')} onKeyDown={(e) => handleKeyDown(e, inputRefs[1])} onFocus={(e) => e.target.select()} />
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
            <div className='d-flex justify-content-center gap-2'>
              <Button text='Edit' variant='edit' onClick={() => handleEditIngredient(index)} disabled={!product.product}/>
              <Button text="Delete" variant='delete' onClick={() => handleDeleteIngredient(index)}/>
            </div>
          </div>

          <p>Weight: {product.weight}g, Calories: {product.calories}, Protein: {product.protein}, Carbs: {product.carbs}, Fat: {product.fat}, Fiber: {product.fiber}, Sugars: {product.sugars}, Caffeine: {product.caffeine}</p>
          {ingredientEdit && editIndex == index  && (
            <IngredientForm onSuccess={(TCProduct) => editIngredient(TCProduct, index)} onCancel={() => setIngredientEdit(null)} ingredientData={product}   />
          )}
        </div>
      ))}
      <hr  />

      <div>
        <label className='d-flex justify-content-between align-items-center mt-2'>
          Portions:
          <input className='input' type="number" value={ form.portions} ref={inputRefs[1]} onChange={(e) => handleDishChange(e, 'portions')} onKeyDown={(e) => handleKeyDown(e, inputRefs[2])} onFocus={(e) => e.target.select()}/>
        </label>
      </div>  
      <div>
        <label className='d-flex justify-content-between align-items-center mt-2'>
          Weight after cooking:
          <input className='input' type="number" value={form.weight_of_ready_product || 0} ref={inputRefs[2]} onChange={(e) => handleDishChange(e, 'weight_of_ready_product')} onKeyDown={(e) => handleKeyDown(e, addDishButtonRef, true )} onFocus={(e) => e.target.select()}/>
        </label>
      </div>  

      <hr className='text-white border-2'/>   
      <p>Dish weight: {form.weight} g</p>
      <p>Calories: {form.calories}, Protein: {form.protein}, Carbs: {form.carbs}, Fat: {form.fat}, Fiber: {form.fiber}, Sugars: {form.sugars}, Caffeine: {form.caffeine} </p>
  
      {!validation.valid && (
        <div className="alert alert-dark text-black mt-2 p-1 text-center" role="alert">
          {validation.message}
        </div>
      )}

      <div className='d-flex justify-content-center gap-2'>
        <Button text='Submit' variant='submit' ref={addDishButtonRef}  onClick={handleSubmit} data-bs-dismiss='modal' data-bs-target={dishToEdit ? '#modalEditDish' :'#modalDishOwn'} disabled={!validation.valid}/>
        <Button text="Cancel" variant='cancel' data-bs-dismiss='modal' data-bs-target={dishToEdit ? '#modalEditDish' : '#modalDishOwn'} type='button' onClick={handleCancel}/>
      </div>
      {successMessage && <p>{successMessage}</p>}
    </div>
 
  );
};

export default CustomDishForm; 