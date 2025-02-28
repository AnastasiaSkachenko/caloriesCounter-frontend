import React, { useState, useRef, RefObject, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';  
import {  DiaryRecord, Dish } from '../interfaces';
import { fetchDishes, getDishNames } from '../../utils/dish';
import { usePutDiaryRecord, useSetDiaryRecord } from '../../hooks/caloriesCounter';

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
    id: 0, name: '', image: '',  calories: 0, protein: 0, carbohydrate: 0, fat: 0, dish: 0, date: '', weight: 100, portions: 1
  });
  const [currentDish, setCurrentDish] = useState<Dish | null>()
  const addRecordButtonRef = useRef<HTMLButtonElement>(null);

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

    } 
  }
  }

  
  const [inputRefs] = useState([
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]);

  //focus dependent on data
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
 
    //validations
  useEffect(() => {
    if (filteredSuggestions.length == 0  && !currentDish ) {
      setValidation({message: 'No such dish or product. Create one first', valid: false})
    } else if (!currentDish ) {
      setValidation({message: 'Dish or product  is required', valid: false})
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

  //get dish
  useEffect(() => {
    const fetchDish = async () => {
      if (recordData?.name) {
        await getDish(recordData.name);
      }
    };

    fetchDish(); // Call the async function to fetch the product

  }, [recordData?.name]);
  

 
  const toggleInputMode = () => {
    setInputMode((prevMode) => (prevMode === "weight" ? "portions" : "weight"));
  };

  useEffect(() => {
    if (currentDish && inputRefs[1]?.current) {
      inputRefs[1].current.focus();
    }
  }, [currentDish]);

  useEffect(() => {
    const handleMacros = () => {
      if (!currentDish) return;
     
      setRecordInfo((prevRecord) => {
        const { weight, portions } = prevRecord;
    
        if (inputMode === "weight" ) {
          if (weight) {
            return {
              ...prevRecord,
              calories: Math.round((weight * currentDish.calories_100) / 100),
              protein: Math.round((weight * currentDish.protein_100) / 100),
              carbohydrate: Math.round((weight * currentDish.carbohydrate_100) / 100),
              fat: Math.round((weight * currentDish.fat_100) / 100),
            };  
          } else {
            return {
              ...prevRecord,
              calories: 0,
              protein: 0,
              carbohydrate: 0,
              fat: 0,
            };  
          }
        }
    
        if (inputMode === "portions" && portions && portions > 0) {
          if (portions) {
            return {
              ...prevRecord,
              calories: Math.round((portions * currentDish.calories_100 * currentDish.portion) / 100),
              protein: Math.round((portions * currentDish.protein_100 * currentDish.portion) / 100),
              carbohydrate: Math.round((portions * currentDish.carbohydrate_100 * currentDish.portion) / 100),
              fat: Math.round((portions * currentDish.fat_100 * currentDish.portion) / 100),
            };  
          } else {
            return {
              ...prevRecord,
              calories: 0,
              protein: 0,
              carbohydrate: 0,
              fat: 0,
            };  
          }
        }
    
        return prevRecord;
      });
  
    }

    handleMacros()
  }, [inputMode, record.portions, record.weight, currentDish])


  const { setDiaryRecord } = useSetDiaryRecord()
  const { putDiaryRecord } = usePutDiaryRecord()


  const handleRecordChange = (field: "weight" | "portions", valueRaw: string |number) => {
    console.log(Number(valueRaw), 'here')
    const value = Number(valueRaw) > 0 ?  Number(valueRaw) : valueRaw;
    console.log('value', value)
    setRecordInfo((prevRecord) => ({
      ...prevRecord,
      [field]: value,
    }));
   };

 
  

// get current dish from existing dishes

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
 
    setFilteredSuggestions(filterSuggestions ?? []);
 
    getDish(value) 
  };
 

  const handleSubmit = async () => {  
    if (inputMode == 'portions') {
      setRecordInfo(prev => ({
        ...prev,
        weight: undefined
      }))
    } else {
      setRecordInfo(prev => ({
        ...prev,
        portions: undefined
      }))
    }
    if (recordData) {

      putDiaryRecord({diaryRecord:record})
    } else {
      setDiaryRecord({diaryRecord:record})
    }

    setRecordInfo({
      id: 0, name: '', image: '', weight: 0, calories: 0, protein: 0, carbohydrate: 0, fat: 0, dish: 0, date: '', portions: 0})
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
        <label className='form-label full-length-label my-2'>
          Dish or Product Name:
          <input className='form-control full-length-input form-control-sm my-2' list='suggestions' type="text" value={record.name}  ref={inputRefs[0]} onChange={(e) => handleDishNameChange(e)} />
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
                  value={inputMode === "weight" ? record.weight : record.portions }
                  ref={inputRefs[1]}
                  onChange={(e) =>
                    handleRecordChange(inputMode,e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  onFocus={(e) => e.target.select()}
                  disabled={!currentDish}
                  />
                  <button className='btn btn-dark flex-shrink-0' type="button" onClick={toggleInputMode}>
                      {inputMode === "weight" ? "Portions" : "Weight"}
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

      {!validation.valid && (
        <div className="alert alert-dark text-black mt-2 p-1 text-center" role="alert">
          {validation.message}
        </div>
      )}

      <div className='d-flex justify-content-center'>
        <button type='button'  className='btn btn-dark' ref={addRecordButtonRef} onClick={() => handleSubmit()} data-bs-dismiss='modal' data-bs-target={recordData ? '#modalEdit' : '#modal'} disabled={!validation.valid}> {recordData ? 'Edit Record' : 'Add Record'}</button>
        <button type='button' className='btn btn-danger' onClick={handleOnCancel} data-bs-dismiss='modal' data-bs-target={recordData ? '#modalEdit' : '#modal'}  >Cancel</button>
        </div>
    </div>
  );
};

export default RecordForm; 