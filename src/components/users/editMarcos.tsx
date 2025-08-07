import { useState, useEffect, useRef } from 'react'; 
import { MacroNitrientUser, ModifyUser } from '../interfaces';
import '../../style.css';
import '../../index.css'
import useAuth from '../../hooks/useAuth';
import { useModify } from '../../utils/userUtils';
import { useHandleKeyDown } from '../../utils/utils';
import Button from '../../customComponents/Button';


const nutritions: { title: string; value: MacroNitrientUser }[] = [
  {title: "Calories", value: "calories_d"},
  {title: "Protein", value: "protein_d"},
  {title: "Carbs", value: "carbs_d"},
  {title: "Fat", value: "fat_d"},
  {title: "Fiber", value: "fiber_d"},
  {title: "Sugars", value: "sugars_d"},
  {title: "Caffeine", value: "caffeine_d"}
]



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
  const { handleKeyDown } = useHandleKeyDown()

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
      {nutritions.map((nutrition, index) => (
        <label key={index} className='d-flex justify-content-between align-items-center mt-2' >{nutrition.title} for a day:
          <input className='input' ref={inputRefs[index]} type="number" step="1" name={nutrition.value} value={formState[nutrition.value]} required onFocus={(e) => e.target.select()}
            onChange={(e) => setFormState(prev => ({...prev, [nutrition.value]: Number(e.target.value)}))}
            onKeyDown={(e) => handleKeyDown(e, index + 1 == nutritions.length ? saveChangesButtonRef : inputRefs[index + 1])}/>
        </label>
      ))}
    
      <div className='d-flex justify-content-center gap-2'>
        <Button text="Submit" variant='submit' ref={saveChangesButtonRef}  data-bs-dismiss='modal' data-bs-target={'#editMacros'} type="button" onClick={handleSubmit} />
        <Button text="Cancel" variant='cancel'  data-bs-dismiss= 'modal' data-bs-target={'#editMacros'} type='button' onClick={handleCancel}/>
      </div>
    
    </div>
 

  );
};

export default EditMacros;
