import React, { useState, useRef, useEffect } from 'react';
import { Dish } from '../interfaces';
import '../../index.css'
import '../../style.css' ;
import { usePreMadeDishSchema } from '../../utils/validationSchemes';
import { convertObjectToFormData, useHandleKeyDown } from '../../utils/utils';
import { v4 as uuidv4 } from 'uuid';
import Button from '../../customComponents/Button';
import useAuth from '../../hooks/useAuth';
import { useDishMutations } from '../../hooks/mutations/dishes';
import MediaPicker from '../general/mediaPicker';
import SwitchInput from '../general/SwitchInput';
import { nutritionsDish } from '../../assets/constants/nutritions';
import Input from '../general/Input';
import { DishFormProps } from '../props';

const PreMadeDishForm: React.FC<DishFormProps> = ({ onSuccess, onCancel, dishToEdit }) => {
  const { auth } = useAuth()
  const [form, setForm] = useState<Dish>(dishToEdit ?? {
    id: uuidv4(), name: '', calories: 0, calories_100: 0, protein: 0, carbs: 0,
    fat: 0, protein_100: 0, carbs_100: 0, fat_100: 0, weight: 0, drink: false,
    portion: 100, portions: 1, type: 'pre_made',  description: '', user: auth.user?.id ?? 0, favorite: false,
    fiber: 0, fiber_100: 0, sugars: 0, sugars_100: 0, caffeine: 0, caffeine_100: 0, media_to_delete: []
  });
  const [validation, setValidation] = useState<{ message: string | undefined, valid: boolean }>({ message: undefined, valid: false });
  const addDishButtonRef = useRef<HTMLButtonElement>(null);
  const {handleKeyDown} = useHandleKeyDown()
  const validationSchema = usePreMadeDishSchema(dishToEdit && dishToEdit.name)

  const { putDish, setDish } = useDishMutations()

  useEffect(() => {
    if (auth?.user && !dishToEdit && auth.user.id > 0) {
      setForm(prev => ({
        ...prev,
        user: auth.user?.id ?? 0
      }));
    }
  }, [auth.user, dishToEdit]);

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
      portion: 100, portions: 1, type: 'pre_made',  description: '', user: auth.user?.id ?? 0, favorite: false,
      fiber: 0, fiber_100: 0, sugars: 0, sugars_100: 0, caffeine: 0, caffeine_100: 0, media_to_delete: []
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


  useEffect(() => {
    validationSchema.validate(form)
      .then(() => setValidation({ valid: true, message: undefined }))
      .catch((err) => setValidation({ valid: false, message: err.message }));
  }, [form, dishToEdit, validationSchema]);
 
  const handleDishChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: 'name' |  'drink' | 'calories_100' | 'protein_100' | 'carbs_100' | 'fat_100' | 'portion' | 'type' | 'fiber_100' | 'sugars_100' | 'caffeine_100' | 'media') => {
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

  const handleSubmit = async () => {
    if (typeof form.portion != 'number' || form.portion == null ||  form.portion < 1) {
      setValidation({message: 'Weight of portion cannot be less than 1g', valid: false})
      return
    }

    const formData = await convertObjectToFormData(form, "dish")

    if (dishToEdit) {
      putDish({ dish: formData, id: form.id});
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

      <MediaPicker media={form.media} mediaChange={(media) => setForm((prevDish) => ({ ...prevDish, media }))} setMediaToDelete={(media_to_delete) => setForm(prev => ({...prev, media_to_delete}))}/>

      <SwitchInput
        title={form.drink ? " Drink" : " Dish"}
        onChange={(e) => setForm((prevDish) => ({ ...prevDish, drink: e.target.checked }))}
        checked={form.drink}
        name='drink'
      />

      {nutritionsDish.map((nutrient, index) => (
        <Input
          key={index}
          title={`${nutrient.title} for 100g:`}
          type="number" 
          value={form[nutrient.value]} 
          refObj={inputRefs[index + 1]} 
          onChange={(e) => handleDishChange(e, nutrient.value)}
          refObjNext={inputRefs[index + 2]}
        />
      ))}

      <Input
        title='Weight of 1 portion (g):'
        value={form.portion}
        onChange={(e) => handleDishChange(e, 'portion')} 
        refObj={inputRefs[8]} 
        refObjNext={addDishButtonRef}
      />

      {!validation.valid && (
        <div className="alert alert-dark text-black mt-2 p-1 text-center" role="alert">
          {validation.message}
        </div>
      )}

      <div className='d-flex justify-content-center align-items-center gap-2 mt-2'>
        <Button text='Submit Dish' variant='submit' ref={addDishButtonRef} onClick={handleSubmit} data-bs-dismiss='modal' data-bs-target={dishToEdit ? '#modalEditDish' : '#modalDishBought'} disabled={!validation.valid}/>
        <Button text='Cancel' variant='cancel' data-bs-dismiss='modal' data-bs-target={dishToEdit ? '#modalEditDish' : '#modalDishBought'} type='button' onClick={handleCancel}/>
      </div>
    </div>
  );
};

export default PreMadeDishForm; 