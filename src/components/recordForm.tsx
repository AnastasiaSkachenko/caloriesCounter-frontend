import React, { useState, useRef, RefObject, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';  
import {  DiaryRecord, Dish } from './interfaces';
import { fetchDishes, getDishNames } from '../utils/caloriesCounter';
import { usePutDiaryRecord, useSetDiaryRecord } from '../hooks/caloriesCounter';

interface RecordFormProps {
  onSuccess?: () => void
  onCancel?: () => void,
  recordData?: DiaryRecord,
}

const RecordForm: React.FC<RecordFormProps> = ({onSuccess, onCancel, recordData}) => { 

  const {
      status, error, isLoading,data: dishNames
  } = useQuery({
      queryKey: ['dishNames'], 
      queryFn: () => getDishNames(), 
  });

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([''])
  const [validation, setValidation] = useState<{message: string | undefined, valid: boolean}>({message: undefined, valid: false})
  const [inputMode, setInputMode] = useState<"weight" | "portions">(recordData? (recordData.weight  ? 'weight': 'portions'):"weight");
  const [record, setRecordInfo] = useState<DiaryRecord>(recordData??{
    id: 0, name: '', image: '', weight: 100, calories: 0, protein: 0, carbohydrate: 0, fat: 0, dish: 0,date: '', portions: 1
  });
  const [currentDish, setCurrentDish] = useState<Dish | null>()
  const addRecordButtonRef = useRef<HTMLButtonElement>(null);
  
  const [inputRefs] = useState([
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]);
  
  useEffect(() => {
    const modalElement = document.getElementById(recordData ? 'modalEdit' : 'modal');
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
  }, [inputRefs, recordData]);
 
    
  useEffect(() => {
    if (filteredSuggestions.length == 0  && !currentDish ) {
      setValidation({message: 'No such dish. Create one first', valid: false})
    } else if (!currentDish ) {
      setValidation({message: 'Dish  is required', valid: false})
    } else if (inputMode == 'weight' && record.weight == 0) {
      setValidation({message: 'Enter weight.', valid: false})
    } else if (inputMode == 'portions' && record.portions == 0) {
      setValidation({message: 'Enter number of portions', valid: false})
    } else  if (record.weight && record.weight < 1) {
      setValidation({message:'Weight must be greater than 0.', valid: false});
    } else {
      setValidation({message: undefined, valid: true})
    } 
  }, [currentDish, inputMode, record.name, record.portions, record.weight, filteredSuggestions])

 
  const toggleInputMode = () => {
    setInputMode((prevMode) => (prevMode === "weight" ? "portions" : "weight"));
  };

  useEffect(() => {
    if (!currentDish) return;
  
    setRecordInfo((prevRecord) => {
      const { weight, portions } = prevRecord;
  
      if (inputMode === "weight" && weight && weight > 0) {
        return {
          ...prevRecord,
          calories: Math.round((weight * currentDish.calories_100) / 100),
          protein: Math.round((weight * currentDish.protein_100) / 100),
          carbohydrate: Math.round((weight * currentDish.carbohydrate_100) / 100),
          fat: Math.round((weight * currentDish.fat_100) / 100),
        };
      }
  
      if (inputMode === "portions" && portions && portions > 0) {
        return {
          ...prevRecord,
          calories: Math.round((portions * currentDish.calories_100 * currentDish.portion) / 100),
          protein: Math.round((portions * currentDish.protein_100 * currentDish.portion) / 100),
          carbohydrate: Math.round((portions * currentDish.carbohydrate_100 * currentDish.portion) / 100),
          fat: Math.round((portions * currentDish.fat_100 * currentDish.portion) / 100),
        };
      }
  
      return prevRecord;
    });
  
  }, [currentDish, inputMode, record.weight, record.portions]);
  
  const { setDiaryRecord } = useSetDiaryRecord()
  const { putDiaryRecord } = usePutDiaryRecord()


  const handleRecordChange = (field: "weight" | "portions", valueRaw: number) => {
    const value = Number(valueRaw);
    setRecordInfo((prevRecord) => ({
      ...prevRecord,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (!currentDish) return;
  
    setRecordInfo((prevRecord) => {
      const { weight, portions } = prevRecord;
  
      if ( inputMode == 'weight' &&  weight && weight > 0) {
        return {
          ...prevRecord,
          calories: Math.round((weight * currentDish.calories_100) / 100),
          protein: Math.round((weight * currentDish.protein_100) / 100),
          carbohydrate: Math.round((weight * currentDish.carbohydrate_100) / 100),
          fat: Math.round((weight * currentDish.fat_100) / 100),
        };
      }
  
      if (inputMode == 'portions' && portions && portions > 0) {
        return {
          ...prevRecord,
          calories: Math.round((portions * currentDish.calories_100 * currentDish.portion) / 100),
          protein: Math.round((portions * currentDish.protein_100 * currentDish.portion) / 100),
          carbohydrate: Math.round((portions * currentDish.carbohydrate_100 * currentDish.portion) / 100),
          fat: Math.round((portions * currentDish.fat_100 * currentDish.portion) / 100),
        };
      }
  
      return prevRecord;
    });
  
    setValidation({ message: undefined, valid: true });
  }, [currentDish, inputMode]);
  
  
  

// get current dish from existing dishes
  const getDish = async (dishName:string) => {
    const dishNameExists = dishNames?.find(dish => dish === dishName);
    if (dishNameExists) {
      const response = await fetchDishes({pageParam:1, query: dishName})
      const dishes: Dish[] = response.dishes
      const dish = dishes?.find(dish => dish.name === dishName);
      if (dish) {  
      setRecordInfo((prevRecord) => ({
          ...prevRecord,
          name: dish.name,
          dish: dish.id
      }));  
      setCurrentDish(dish)
      setFilteredSuggestions([])

      if (inputRefs[1].current) {
        inputRefs[1].current.focus();
      }
    } 
  }
  }

  const handleDishNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    setRecordInfo((prevRecord) => ({
      ...prevRecord,
      name: value
    }))

    if (value != record.name) {
      setCurrentDish(undefined)
    }

    const filterSuggestions = dishNames?.filter(dish => dish.startsWith(value));

    setFilteredSuggestions(filterSuggestions || []);
 
    getDish(value) 
  };
 

  const handleSubmit = async () => {  
    if (recordData) {
      putDiaryRecord({diaryRecord:record})
    } else {
      setDiaryRecord({diaryRecord:record})
    }

    setRecordInfo({
      id: 0, name: '', image: '', weight: 0, calories: 0, protein: 0, carbohydrate: 0, fat: 0, dish: 0, date: ''})
    setCurrentDish(null)
  
    if (onSuccess) onSuccess()

  }
 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, next?:RefObject<HTMLInputElement>) => { 
    if (e.key === 'Enter') {
      e.preventDefault(); 

      if (next) {
        const nextRef = next.current; 
        if (nextRef) {
          nextRef.focus();
        }  
      } else {
        if (addRecordButtonRef.current) {
          addRecordButtonRef.current.click(); 
        }
      }
    }
  };

  const handleOnCancel = () => {
    setRecordInfo({
      id: 0, name: '', image: '', weight: 0, calories: 0, protein: 0, carbohydrate: 0, fat: 0, dish: 0, date: ''})
    if (onCancel) onCancel()
  }
 
  if (isLoading) return <h1>Loading...</h1>;
  if (status=== 'error') return <h1>{JSON.stringify(error)}</h1>;
 
  return (
    <div className='modal-body'> 
      <div>
        <label className='form-label create-label my-2'>
          Dish or Product Name:
          <input className='form-control create-input form-control-sm my-2' list='suggestions' type="text" value={record.name}  ref={inputRefs[0]} onChange={(e) => handleDishNameChange(e)} />
          <datalist id='suggestions'>
            {filteredSuggestions.map((dish, index) => (
              <option key={index} value={dish}/>
            ))}  
          </datalist> 
        </label>   
        <div>
          <div>
            <label>
              {inputMode === "weight" ? "Weight (g):" : (currentDish ? `Portions (in one portion ${currentDish?.portion}g):`: 'Choose dish first to see weight of portion:')}
              <div className='d-flex align-items-center'>
                <input
                  type="number"
                  className='border border-light rounded p-1 '
                  value={inputMode === "weight" ? record.weight || 100 : record.portions || 1}
                  ref={inputRefs[1]}
                  onChange={(e) =>
                    handleRecordChange(inputMode, Number(e.target.value))
                  }
                  onKeyDown={handleKeyDown}
                  onFocus={(e) => e.target.select()}
                  disabled={!currentDish}
                  />
                  <button className='btn btn-dark' type="button" onClick={toggleInputMode}>
                    Switch to {inputMode === "weight" ? "Portions" : "Weight"}
                  </button>
              </div>

            </label>
          </div>            
        <br/>

        <label className='d-flex justify-content-between align-items-center mt-2'>
          Calories (g):
          <input type="number" className='border border-light rounded p-1 mx-2 ' value={record.calories }  disabled />
        </label>


        <label className='d-flex justify-content-between align-items-center mt-2'>
          Protein (g):
          <input type="number" className='border border-light rounded p-1 mx-2 ' value={record.protein } disabled />
        </label>

        <label className='d-flex justify-content-between align-items-center mt-2'>
          Carbohydrates (g):
          <input type="number" className='border border-light rounded p-1 mx-2 ' value={record.carbohydrate } ref={inputRefs[4]} disabled />
        </label>

        <label className='d-flex justify-content-between align-items-center mt-2'>
          Fat (g):
          <input type="number" className='border border-light rounded p-1 mx-2 ' value={record.fat } ref={inputRefs[5]}  disabled />
        </label>
        </div>
      </div>  

      <div className='d-flex justify-content-center'>
        <div className='tooltip-trigger p-0'>
          {!validation.valid && <span className='tooltip'>{validation.message}</span>}
          <button type='button'  className='btn btn-dark' ref={addRecordButtonRef} onClick={() => handleSubmit()} data-bs-dismiss='modal' data-bs-target={recordData ? '#modalEdit' : '#modal'} disabled={!validation.valid}> {recordData ? 'Edit Record' : 'Add Record'}</button>
        </div>
        <button type='button' className='btn btn-danger' onClick={handleOnCancel} data-bs-dismiss='modal' data-bs-target={recordData ? '#modalEdit' : '#modal'}  >Cancel</button>
        </div>
    </div>
  );
};

export default RecordForm; 