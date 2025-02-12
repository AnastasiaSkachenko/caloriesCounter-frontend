import React, { useState, useEffect, useRef } from 'react'; 
import { ModifyUser } from './interfaces';
import '../../styles/style.css';
import '../index.css'
import useAuth from '../hooks/useAuth';
import { useModify } from '../utils/userUtils';



const EditMacros= () => {
  const { auth } = useAuth()

  const [formState, setFormState] = useState<ModifyUser>({
    protein_d: auth.user?.protein_d || 0,
    carbohydrate_d: auth.user?.carbohydrate_d || 0,
    fat_d: auth.user?.fat_d || 0,
    calories_d: auth.user?.calories_d || 0
  });

  const { modify} = useModify()

  const saveChangesButtonRef = useRef<HTMLButtonElement>(null)
 
  const [inputRefs] = useState([
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
      
   


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const {  calories_d, protein_d, carbohydrate_d, fat_d } = formState;

    const formData = new FormData()

    formData.append('calories_d', calories_d.toString())
    formData.append('protein_d', protein_d.toString())
    formData.append('carbohydrate_d', carbohydrate_d.toString())
    formData.append('fat_d', fat_d.toString())
 
    await modify(formData)

 

    
  }

  const handleCancel = () => {
    setFormState({    
      protein_d: auth.user?.protein_d || 0,
      carbohydrate_d: auth.user?.carbohydrate_d || 0,
      fat_d: auth.user?.fat_d || 0,
      calories_d: auth.user?.calories_d || 0
    })
    
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index?: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (index) {
        const nextRef = inputRefs[index].current;
        if (nextRef) {
          nextRef.focus();
        }
      } else {
        if (saveChangesButtonRef.current) {
          saveChangesButtonRef.current.click(); 
        }
      } 
    }
  }

  return (
    <div className='modal-body'>
      <label className='d-flex justify-content-between align-items-center mt-2' >Calories for a day:
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[0]} type="number" step="1" name="calories" value={formState.calories_d} required onFocus={(e) => e.target.select()}
          onChange={(e) => setFormState(prev => ({...prev, calories_d: Number(e.target.value)}))}
          onKeyDown={(e) => handleKeyDown(e, 2)}/>
      </label>
      <label  className='d-flex justify-content-between align-items-center mt-2'> Protein for a day: 
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[1]} type="number" step="1"  name="protein" value={formState.protein_d} required onFocus={(e) => e.target.select()}
          onChange={(e) => setFormState(prev => ({...prev, protein_d: Number(e.target.value)}))}
          onKeyDown={(e) => handleKeyDown(e, 3)}/>
      </label>
      <label className='d-flex justify-content-between align-items-center mt-2'  >Carbohydrate for a day: 
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[2]} type="number" step="1"   name="carbohydrate" value={formState.carbohydrate_d} required onFocus={(e) => e.target.select()}
          onChange={(e) => setFormState(prev => ({...prev, carbohydrate_d: Number(e.target.value)}))}
          onKeyDown={(e) => handleKeyDown(e, 4)}/>
      </label>
      <label className='d-flex justify-content-between align-items-center mt-2'> Fat for a day:
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[3]} type="number" step="1"  name="fat" value={formState.fat_d} required onFocus={(e) => e.target.select()}
          onChange={(e) => setFormState(prev => ({...prev, fat_d: Number(e.target.value)}))}
          onKeyDown={(e) => handleKeyDown(e)}/>
      </label>
    
      <div className='d-flex justify-content-center'>
        <button ref={saveChangesButtonRef} className='btn btn-primary p-2' data-bs-dismiss='modal' data-bs-target={'#editMacros'} type="button" onClick={handleSubmit} >Submit</button>
        <button className='btn btn-danger btn-sm p-2 ' data-bs-dismiss= 'modal' data-bs-target={'#editMacros'} type='button' onClick={handleCancel}>Cancel</button>
      </div>
    
    </div>
 

  );
};

export default EditMacros;
