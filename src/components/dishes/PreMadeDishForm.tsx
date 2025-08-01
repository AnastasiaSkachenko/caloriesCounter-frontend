import React, { useState, useRef, useEffect } from 'react';
import { Dish, DishFormProps } from '../interfaces';
import { usePutDish, useSetDish} from '../../hooks/caloriesCounter';
import '../../index.css'
import '../../style.css' ;
import useAuth from '../../hooks/useAuth';
import { preMadeDishSchema } from '../../utils/validation schemes';
import { useHandleKeyDown } from '../../utils/utils';
import { v4 as uuidv4 } from 'uuid';


const PreMadeDishForm: React.FC<DishFormProps> = ({ onSuccess, onCancel, dishToEdit }) => {
  const { auth } = useAuth()
  const [form, setForm] = useState<Dish>(dishToEdit ?? {
    id: uuidv4(), name: '', calories: 0, calories_100: 0, protein: 0, carbs: 0,
    fat: 0, protein_100: 0, carbs_100: 0, fat_100: 0, weight: 0, drink: false,
    portion: 100, portions: 1, type: 'pre_made', image: '', description: '', user: 0, favorite: false,
    fiber: 0, fiber_100: 0, sugars: 0, sugars_100: 0, caffeine: 0, caffeine_100: 0
  });

  const [validation, setValidation] = useState<{ message: string | undefined, valid: boolean }>({ message: undefined, valid: false });
  const addDishButtonRef = useRef<HTMLButtonElement>(null);
  const {handleKeyDown} = useHandleKeyDown()

  useEffect(() => {
    if (dishToEdit ) {
      setForm(dishToEdit);
    }
  }, [dishToEdit]);

  const [inputRefs] = useState([
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]);

  const resetForm = () => {
    setForm({
      id: uuidv4(), name: '', calories: 0, calories_100: 0, protein: 0, carbs: 0,
      fat: 0, protein_100: 0, carbs_100: 0, fat_100: 0, weight: 0, drink: false,
      portion: 100, portions: 1, type: 'pre_made', image: '', description: '', user: 0, favorite: false,
      fiber: 0, fiber_100: 0, sugars: 0, sugars_100: 0, caffeine: 0, caffeine_100: 0
    })
  }

  useEffect(() => {
    const modalElement = document.getElementById(  'modalDishBought');
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

  const { putDish } = usePutDish();
  const { setDish } = useSetDish();

 

  useEffect(() => {
    const validationSchema = preMadeDishSchema(dishToEdit && dishToEdit.name)
    validationSchema.validate(form)
      .then(() => setValidation({ valid: true, message: undefined }))
      .catch((err) => setValidation({ valid: false, message: err.message }));
  }, [form, dishToEdit]);
    
  
  
 
  
  const handleDishChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'name' | 'image' | 'drink' | 'calories_100' | 'protein_100' | 'carbs_100' | 'fat_100' | 'portion' | 'type' | 'fiber_100' | 'sugars_100' | 'caffeine_100') => {
    const newValue = e.target.value;
    console.log(newValue);
    if (field === 'name') {
      setForm((prevDish) => ({ ...prevDish, [field]: newValue.slice(0, 1).toUpperCase() + newValue.slice(1) }));
    } else if (field === 'portion' && Number(newValue) > 0) {
      setForm((prevDish) => ({ ...prevDish, [field]: Number(newValue) }));
    } else {
      setForm((prevDish) => ({ ...prevDish, [field]: newValue }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList
    }
    setForm((prevFormSate) => ({ ...prevFormSate, image: target.files[0] }));
    const nextRef = form.name === '' ? inputRefs[0].current : inputRefs[1].current;
    if (nextRef) {
      nextRef.focus();
    }
  };

  const handleSubmit = async () => {
    console.log(form, 'form')
    if (typeof form.portion != 'number' || form.portion == null ||  form.portion < 1) {
      setValidation({message: 'Weight of portion cannot be less than 1g', valid: false})
      return
    }

    const formData = new FormData();

    if (form.image && typeof form.image !== 'string') formData.append('image', form.image);
    formData.append('type', form.type);

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    Object.entries(form).forEach(([key, value]) => {
      if (key === "name") {
        formData.append(key, capitalize(value as string));
      }if (key === "user" ) {
        formData.append(key, (auth.user?.id ?? 0).toString());
      } else if (key !== "product" && key !== "image" && key !=='product_old') {
        console.log(key, value)
        formData.append(key, value.toString());
      }
    });

    if (dishToEdit) {
      putDish({ dish: formData, id: form.id });
    } else {
      await setDish({ dish: formData });
    }

    const modal = document.getElementById(dishToEdit ? 'modalEditDish' : 'modalDishBought');
    modal?.classList.remove('show');

    resetForm()
    setValidation({ message: undefined, valid: true });


    if (onSuccess) onSuccess();
  };

  const handleCancel = () => {
    resetForm()
    setValidation({ message: undefined, valid: true });

    if (onCancel) onCancel();
  };

  return (
    <div className='modal-body'>
      <label className='form-label full-length-label'>
        Dish Name:
        <input className='form-control full-length-input form-control-sm my-2' type="text" ref={inputRefs[0]} onKeyDown={(e) => handleKeyDown(e, inputRefs[1])} value={form.name} onChange={(e) => handleDishChange(e, 'name')} />
      </label>
      <label className='form-label full-length-label my-2'>
        <input className='form-control form-control-file bg-secondary text-white' type='file' name='image' accept='image/png, image/jpg, image/jpeg' onChange={(e) => handleImageChange(e)} />
      </label>

      <label className="form-check form-switch">
        <input className="form-check-input" type="checkbox" role="switch" checked={form.drink}
          onChange={(e) => setForm((prevDish) => ({ ...prevDish, drink: e.target.checked }))} />
        {form.drink ? " Drink" : " Dish"}
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Calories for 100g:
        <input className='border border-light rounded p-1 mx-2' type="number" value={form.calories_100} ref={inputRefs[1]} onChange={(e) => handleDishChange(e, 'calories_100')} onKeyDown={(e) => handleKeyDown(e, inputRefs[2])}   onFocus={(e) => e.target.select()} />
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Protein for 100g:
        <input className='border border-light rounded p-1 mx-2' type="number" value={form.protein_100} ref={inputRefs[2]} onChange={(e) => handleDishChange(e, 'protein_100')} onKeyDown={(e) => handleKeyDown(e, inputRefs[3])}   onFocus={(e) => e.target.select()} />
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Carbs for 100g:
        <input className='border border-light rounded p-1 mx-2' type="number" value={form.carbs_100} ref={inputRefs[3]} onChange={(e) => handleDishChange(e, 'carbs_100')} onKeyDown={(e) => handleKeyDown(e, inputRefs[4])}   onFocus={(e) => e.target.select()} />
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Fat for 100g:
        <input className='border border-light rounded p-1 mx-2' type="number" value={form.fat_100 } ref={inputRefs[4]} onChange={(e) => handleDishChange(e, 'fat_100')} onKeyDown={(e) => handleKeyDown(e, inputRefs[5])}   onFocus={(e) => e.target.select()}/>
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Fiber for 100g:
        <input className='border border-light rounded p-1 mx-2' type="number" value={form.fiber_100 } ref={inputRefs[5]} onChange={(e) => handleDishChange(e, 'fiber_100')} onKeyDown={(e) => handleKeyDown(e, inputRefs[6])}   onFocus={(e) => e.target.select()}/>
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Sugars for 100g:
        <input className='border border-light rounded p-1 mx-2' type="number" value={form.sugars_100 } ref={inputRefs[6]} onChange={(e) => handleDishChange(e, 'sugars_100')} onKeyDown={(e) => handleKeyDown(e, inputRefs[7])}   onFocus={(e) => e.target.select()}/>
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Caffeine for 100g:
        <input className='border border-light rounded p-1 mx-2' type="number" value={form.caffeine_100 } ref={inputRefs[7]} onChange={(e) => handleDishChange(e, 'caffeine_100')} onKeyDown={(e) => handleKeyDown(e, inputRefs[8])}   onFocus={(e) => e.target.select()}/>
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Weight of 1 portion (g):
        <input className='border border-light rounded p-1 mx-2' value={form.portion} onChange={(e) => handleDishChange(e, 'portion')} ref={inputRefs[8]} onKeyDown={(e) => handleKeyDown(e, addDishButtonRef, true)} />
      </label>

      {!validation.valid && (
        <div className="alert alert-dark text-black mt-2 p-1 text-center" role="alert">
          {validation.message}
        </div>
      )}

      <div className='d-flex justify-content-center align-items-center'>
        <button className='btn btn-dark' ref={addDishButtonRef} onClick={handleSubmit} data-bs-dismiss='modal' data-bs-target={dishToEdit ? '#modalEditDish' : '#modalDishBought'} disabled={!validation.valid}>Submit Dish</button>
        <button className='btn btn-danger btn-sm p-2' data-bs-dismiss='modal' data-bs-target={dishToEdit ? '#modalEditDish' : '#modalDishBought'} type='button' onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

 

export default PreMadeDishForm; 