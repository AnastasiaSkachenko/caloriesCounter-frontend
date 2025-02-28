import React, { useState, useRef, useEffect } from 'react';
import { Dish, DishFormProps } from '../interfaces';
import { usePutDish, useSetDish} from '../../hooks/caloriesCounter';
import '../../index.css'
import '../../style.css' ;
import useAuth from '../../hooks/useAuth';
import { preMadeDishSchema } from '../../utils/validation schemes';
import { useHandleKeyDown } from '../../utils/utils';


const PreMadeDishForm: React.FC<DishFormProps> = ({ onSuccess, onCancel, dishToEdit }) => {
  const { auth } = useAuth()
  const [dishInfo, setDishInfo] = useState<Dish>(dishToEdit ?? {
    id: 0, name: '', calories: 0, calories_100: 0, protein: 0, carbohydrate: 0,
    fat: 0, protein_100: 0, carbohydrate_100: 0, fat_100: 0, weight: 0, drink: false,
    portion: 100, portions: 1, type: 'pre_made', image: '', description: '', user: 0
  });

  const [validation, setValidation] = useState<{ message: string | undefined, valid: boolean }>({ message: undefined, valid: false });
  const addDishButtonRef = useRef<HTMLButtonElement>(null);
  const {handleKeyDown} = useHandleKeyDown()

 

    useEffect(() => {
      if (dishToEdit ) {
        setDishInfo(dishToEdit);
      }
    }, [dishToEdit]);
  

  const { putDish } = usePutDish();
  const { setDish } = useSetDish();

 

  useEffect(() => {
    const validationSchema = preMadeDishSchema(dishToEdit && dishToEdit.name)
    validationSchema.validate(dishInfo)
      .then(() => setValidation({ valid: true, message: undefined }))
      .catch((err) => setValidation({ valid: false, message: err.message }));
  }, [dishInfo, dishToEdit]);
    
    const [inputRefs] = useState([
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
    ]);
  
  
 
  
    const handleDishChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'name' | 'image' | 'drink' | 'calories_100' | 'protein_100' | 'carbohydrate_100' | 'fat_100' | 'portion' | 'type' ) => {
    const newValue = e.target.value;
    console.log(newValue);
    if (field === 'name') {
      setDishInfo((prevDish) => ({ ...prevDish, [field]: newValue.slice(0, 1).toUpperCase() + newValue.slice(1) }));
    } else if (field === 'portion' && Number(newValue) > 0) {
      setDishInfo((prevDish) => ({ ...prevDish, [field]: Number(newValue) }));
    } else {
      setDishInfo((prevDish) => ({ ...prevDish, [field]: newValue }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList
    }
    setDishInfo((prevFormSate) => ({ ...prevFormSate, image: target.files[0] }));
    const nextRef = dishInfo.name === '' ? inputRefs[0].current : inputRefs[1].current;
    if (nextRef) {
      nextRef.focus();
    }
  };

  const handleSubmit = async () => {
    if (typeof dishInfo.portion != 'number' || dishInfo.portion == null ||  dishInfo.portion < 1) {
      setValidation({message: 'Weight of portion cannot be less than 1g', valid: false})
      return
    }

    const formData = new FormData();

    if (dishInfo.image && typeof dishInfo.image !== 'string') formData.append('image', dishInfo.image);
    formData.append('type', dishInfo.type);

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    Object.entries(dishInfo).forEach(([key, value]) => {
      if (key === "name") {
        formData.append(key, capitalize(value as string));
      }if (key === "user" ) {
        formData.append(key, (auth.user?.id ?? 0).toString());
      } else if (key !== "product" && key !== "image") {
        formData.append(key, value.toString());
      }
    });

    if (dishToEdit) {
      putDish({ dish: formData, id: dishInfo.id });
    } else {
      await setDish({ dish: formData });
    }

    const modal = document.getElementById(dishToEdit ? 'modalEditDish' : 'modalDishBought');
    modal?.classList.remove('show');

    if (onSuccess) onSuccess();
  };

  const handleCancel = () => {
    setDishInfo({
      id: 0, name: '', calories: 0, calories_100: 0, protein: 0, carbohydrate: 0,
      fat: 0, protein_100: 0, carbohydrate_100: 0, fat_100: 0, weight: 0, drink: false,
      portion: 100, portions: 1, type: 'custom', image: '', description: '', user: 0
    });
    setValidation({ message: undefined, valid: true });

    if (onCancel) onCancel();
  };

  return (
    <div className='modal-body'>
      <label className='form-label full-length-label'>
        Dish Name:
        <input className='form-control full-length-input form-control-sm my-2' type="text" ref={inputRefs[0]} onKeyDown={(e) => handleKeyDown(e, inputRefs[1])} value={dishInfo.name} onChange={(e) => handleDishChange(e, 'name')} />
      </label>
      <label className='form-label full-length-label my-2'>
        <input className='form-control form-control-file bg-secondary text-white' type='file' name='image' accept='image/png, image/jpg, image/jpeg' onChange={(e) => handleImageChange(e)} />
      </label>

      <label className="form-check form-switch">
        <input className="form-check-input" type="checkbox" role="switch" checked={dishInfo.drink}
          onChange={(e) => setDishInfo((prevDish) => ({ ...prevDish, drink: e.target.checked }))} />
        {dishInfo.drink ? " Drink" : " Dish"}
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Calories for 100g:
        <input className='border border-light rounded p-1 mx-2' type="number" value={dishInfo.calories_100} ref={inputRefs[1]} onChange={(e) => handleDishChange(e, 'calories_100')} onKeyDown={(e) => handleKeyDown(e, inputRefs[2])}   onFocus={(e) => e.target.select()} />
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Protein for 100g:
        <input className='border border-light rounded p-1 mx-2' type="number" value={dishInfo.protein_100} ref={inputRefs[2]} onChange={(e) => handleDishChange(e, 'protein_100')} onKeyDown={(e) => handleKeyDown(e, inputRefs[3])}   onFocus={(e) => e.target.select()} />
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Carbohydrates for 100g:
        <input className='border border-light rounded p-1 mx-2' type="number" value={dishInfo.carbohydrate_100} ref={inputRefs[3]} onChange={(e) => handleDishChange(e, 'carbohydrate_100')} onKeyDown={(e) => handleKeyDown(e, inputRefs[4])}   onFocus={(e) => e.target.select()} />
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Fat for 100g:
        <input className='border border-light rounded p-1 mx-2' type="number" value={dishInfo.fat_100 } ref={inputRefs[4]} onChange={(e) => handleDishChange(e, 'fat_100')} onKeyDown={(e) => handleKeyDown(e, inputRefs[5])}   onFocus={(e) => e.target.select()}/>
      </label>

      <label className='d-flex justify-content-between align-items-center mt-2'>
        Weight of 1 portion (g):
        <input className='border border-light rounded p-1 mx-2' value={dishInfo.portion} onChange={(e) => handleDishChange(e, 'portion')} ref={inputRefs[5]} onKeyDown={(e) => handleKeyDown(e, addDishButtonRef)} />
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