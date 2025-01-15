import React, { useState, useRef, RefObject, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';  
import {  DiaryRecord, Dish } from './interfaces';
import { fetchDish, fetchDishes } from '../utils/caloriesCounter';
import { usePutDiaryRecord, useSetDiaryRecord } from '../hooks/caloriesCounter';

interface RecordFormProps {
  onSuccess: () => void
  onCancel: () => void,
  recordData?: DiaryRecord,
}

const RecordForm: React.FC<RecordFormProps> = ({onSuccess, onCancel, recordData}) => { 

  const {
      status, error, isLoading, data: dishes,  
  } = useQuery({
      queryKey: ['dishes'], 
      queryFn: () =>  fetchDishes(), 
  });

    const dishNames: string[] = []
    dishes?.map((dish: Dish) => {
      dishNames.push(dish.name)
    })


  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([''])
  const [validationError, setValidationError] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<"weight" | "portions">(recordData? (recordData.weight  ? 'weight': 'portions'):"weight");
  const [record, setRecordInfo] = useState<DiaryRecord>(recordData??{
    id: 0,
    name: '',
    image: '',
    weight: 0,
    calories: 0,
    protein: 0,
    carbohydrate: 0,
    fat: 0,
    dish: 0,
    date: ''
  });
  const [currentDish, setCurrentDish] = useState<Dish | null>()
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const toggleInputMode = () => {
    setInputMode((prevMode) => (prevMode === "weight" ? "portions" : "weight"));
  };

  useEffect(() => {
    const fetchDishData = async () => {
      if (recordData && currentDish == undefined) {
        try {
          const fetchedDish = await fetchDish(recordData.dish);
          setCurrentDish(fetchedDish);
        } catch (error) {
          console.error('Error fetching dish:', error);
        }
      }
    };
  
    fetchDishData();
  }, [recordData, currentDish]);

  const { setDiaryRecord } = useSetDiaryRecord()
  const { putDiaryRecord } = usePutDiaryRecord()

  

  const suggestions = [
    ...dishNames || []
  ];
    


  const handleRecordChange = (field: 'weight' | 'portions', valueRaw: number) => {
    const value = Number(valueRaw)
    setRecordInfo((prevRecord) => {
      if (field === 'weight' && currentDish) {
        return {
          ...prevRecord,
          weight: value,
          calories: Math.round((value * currentDish.calories_100) / 100),
          protein: Math.round((value * currentDish.protein_100) / 100),
          carbohydrate: Math.round((value * currentDish.carbohydrate_100) / 100),
          fat: Math.round((value * currentDish.fat_100) / 100),
        };
      } else if (field === 'portions' && currentDish) {
        return {
          ...prevRecord,
          portions: value,
          calories: Math.round(value * currentDish.calories_100 * currentDish.portion /100),
          protein: Math.round(value * currentDish.protein_100 * currentDish.portion /100),
          carbohydrate: Math.round(value * currentDish.carbohydrate_100 * currentDish.portion /100),
          fat: Math.round(value * currentDish.fat_100 * currentDish.portion /100),
        };
      }
      return prevRecord; 
    });
    setValidationError(null); 
  };
  

// get current product from existing products
  const getDish = (dishName:string) => {
    const dish = dishes?.find(product => product.name.toLowerCase() === dishName);
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

  const handleDishNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setRecordInfo((prevRecord) => ({
      ...prevRecord,
      name: value.charAt(0).toUpperCase() + value.slice(1)
    }))

    const filterSuggestions = suggestions.filter(product => product.toLowerCase().startsWith(value));

    setFilteredSuggestions(filterSuggestions);
    if (filterSuggestions.length == 0 || filterSuggestions == undefined) {
      setValidationError('No such dish. Create one first')
    } else {
      setValidationError(null)
    }
    getDish(value) 
  };
 

  const handleSubmit = async () => {  
    if (record.weight && record.weight < 1) {
      setValidationError('Weight must be greater than 0.');
      return;
    }  
    if ( record.name == '') {
      setValidationError('dish name cant be empty.');
      return;
    }  

    if (currentDish == undefined) {
      setValidationError('No such dish exists')
      return
    }

 

    if (recordData) {
      putDiaryRecord({diaryRecord:record})
    } else {
      setDiaryRecord({diaryRecord:record})
    }
  
    onSuccess()

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
        handleSubmit();
      }
    }
  };

  const handleOnCancel = () => {
    setRecordInfo({
      id: 0, name: '', image: '', weight: 0, calories: 0, protein: 0, carbohydrate: 0, fat: 0, dish: 0, date: ''})
    onCancel()
  }

 
  if (isLoading) return <h1>Loading...</h1>;
  if (status=== 'error') return <h1>{JSON.stringify(error)}</h1>;
 
  return (
    <div className='form'> 
      <h3> {recordData ? 'Edit Record': 'Add Record'}</h3> 
        <div>
          <label>
            Dish Name:
            <input list='suggestions' type="text" value={record.name || ''}  ref={inputRefs[0]} onChange={(e) => handleDishNameChange(e)} />
            <datalist id='suggestions'>
             {filteredSuggestions.map((dish, index) => (
                <option key={index} value={dish}/>
              ))}  
            </datalist> 
             
          </label>   
          <div>
            <div>
              <label>
                {inputMode === "weight" ? "Weight (g):" : (currentDish ? `Portions(in one portion ${currentDish?.portion}g):`: 'Choose dish first to see weight of portion:')}
                <input
                  type="number"
                  value={inputMode === "weight" ? record.weight || 0 : record.portions || 0}
                  ref={inputRefs[1]}
                  onChange={(e) =>
                    handleRecordChange(inputMode, Number(e.target.value))
                  }
                  onKeyDown={handleKeyDown}
                  onFocus={(e) => e.target.select()}
                />
              </label>
              <button type="button" onClick={toggleInputMode}>
                Switch to {inputMode === "weight" ? "Portions" : "Weight"}
              </button>
            </div>            
          <br/>

          <label>
            Calories (g):
            <input type="number" value={record.calories }  disabled />
          </label>
          <br/>


          <label>
            Protein (g):
            <input type="number" value={record.protein } disabled />
          </label>
          <br/>

          <label>
            Carbohydrates (g):
            <input type="number" value={record.carbohydrate } ref={inputRefs[4]} disabled />
          </label>
          <br/>

          <label>
            Fat (g):
            <input type="number" value={record.fat } ref={inputRefs[5]}  disabled />
          </label>
          <br/>
          </div>
        </div>
 
 
      {validationError && <p style={{ color: 'red' }}>{validationError}</p>} 
      <button type='button' onClick={() => handleSubmit()} > {recordData ? 'Edit Record' : 'Add Record'}</button>
 
      <button type='button' onClick={handleOnCancel}>Cancel</button>
  
    </div>
  );
};

export default RecordForm; 