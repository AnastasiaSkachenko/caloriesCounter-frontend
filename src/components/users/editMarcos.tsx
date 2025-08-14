import { useState, useEffect, useRef } from 'react'; 
import {  ModifyUser } from '../interfaces';
import '../../style.css';
import '../../index.css'
import useAuth from '../../hooks/useAuth';
import Button from '../../customComponents/Button';
import { nutritionsUser } from '../../assets/constants/nutritions';
import Input from '../general/Input';
import { useModify } from '../../requests/user';


const EditMacros = () => {
  const { auth } = useAuth()

  const [formState, setFormState] = useState<ModifyUser>({
    protein_d: auth.user?.protein_d || 0,
    carbs_d: auth.user?.carbs_d || 0,
    fat_d: auth.user?.fat_d || 0,
    calories_d: auth.user?.calories_d || 0,
    sugars_d: auth.user?.sugars_d || 0,
    fiber_d: auth.user?.fiber_d || 0,
    caffeine_d: auth.user?.caffeine_d || 0
  });

  const { modify } = useModify()
  const saveChangesButtonRef = useRef<HTMLButtonElement>(null)
 
  const [inputRefs] = useState([
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]);
  
  useEffect(() => {
    const modalElement = document.getElementById('editMacros');
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
  }, [inputRefs]);

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.entries(formState).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    await modify(formData, false)
  }

  const handleCancel = () => {
    setFormState({    
      protein_d: auth.user?.protein_d || 0,
      carbs_d: auth.user?.carbs_d || 0,
      fat_d: auth.user?.fat_d || 0,
      calories_d: auth.user?.calories_d || 0,
      sugars_d: auth.user?.sugars_d || 0,
      fiber_d: auth.user?.fiber_d || 0,
      caffeine_d: auth.user?.caffeine_d || 0
    })
  }

  return (
    <div className='modal-body'>
      {nutritionsUser.map((nutrition, index) => (
        <Input
          key={index}
          title={`${nutrition.title} for a day:`}
          onChange={(e) => setFormState(prev => ({...prev, [nutrition.value]: Number(e.target.value)}))}
          refObj={inputRefs[index]} 
          type="number" 
          step="1" 
          name={nutrition.value} 
          value={formState[nutrition.value]} 
          refObjNext={nutritionsUser.length ? saveChangesButtonRef : inputRefs[index + 1]}
          required
        />
      ))}

      <div className='d-flex justify-content-center gap-2'>
        <Button text="Submit" variant='submit' ref={saveChangesButtonRef}  data-bs-dismiss='modal' data-bs-target={'#editMacros'} type="button" onClick={handleSubmit} />
        <Button text="Cancel" variant='cancel'  data-bs-dismiss= 'modal' data-bs-target={'#editMacros'} type='button' onClick={handleCancel}/>
      </div>
    </div>
  );
};

export default EditMacros;
