import React, { useState, useEffect, useRef } from 'react';
import {  useQuery } from '@tanstack/react-query';  
import { Product, Ingredient } from './interfaces';
import { fetchIngredient,  fetchProducts, getProductNames } from '../utils/caloriesCounter';
import ProductForm from './ProductForm';

interface IngredientFormProps {
  onSuccess: (ingredient:Ingredient) => void
  onCancel: () => void,
  ingredientId?: number,
  ingredientData?: Ingredient,
}

const IngredientForm: React.FC<IngredientFormProps> = ({onSuccess, onCancel, ingredientData, ingredientId }) => { 

  const [ingredient, setIngredient] = useState<Ingredient>(ingredientData??{
    id: 0,
    name: '',
    weight: 0,
    calories: 0,
    protein: 0,
    carbohydrate: 0,
    fat: 0,
    dish: 0,
    product: 0
  });

  const {
      status: statusProductNames, error: errorProductNames, isLoading: isLoadingProductNames,data: productNames
  } = useQuery({
      queryKey: ['productNames'], 
      queryFn: () => getProductNames(), 
  });

 
 

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([''])
  const [CreatingNewProduct, setCreatingNewProduct] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null)
  const addIngredientButtonRef = useRef<HTMLButtonElement>(null);
  
    


  const [currentProduct, setCurrentProduct] = useState<Product | null>()
  const [focus, setFocus] = useState(true)

  const [inputRefs] = useState([
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]);

  
  useEffect(() => {
    if (inputRefs[0].current && focus) {
      console.log('should wok')
      inputRefs[0].current.focus();
    }
  }, [inputRefs, focus]);
      
  


  //in case when editing ingredient and there just id send to form
  useEffect(() => { 
    const fetchAndSetIngredient = async () => {
      if (ingredient.id == 0 && ingredientId) { 
        const fetchedIngredient = await fetchIngredient(ingredientId); 
        setFilteredSuggestions(prevFiltered =>
          prevFiltered.filter(suggestion => suggestion !== fetchedIngredient.product.name)
        ); 
        setIngredient(fetchedIngredient.ingredient)
        setIngredient((prevIngredient) => ({...prevIngredient, name:fetchedIngredient.product.name}))
        setCurrentProduct(fetchedIngredient.product)
       } 
    };
    fetchAndSetIngredient();
  }, [ingredient.id, ingredientId]);

    useEffect(()=> {
      if (ingredientId) setCreatingNewProduct(null); 
    }, [ingredientId] )
  
    const suggestions = [
      ...productNames || []
  ];
      

    const handleProductInputFocus = () => { 
      setCreatingNewProduct(null) 
      setFocus(false)
    };

    const handleIngredientChange = (field: 'weight' | 'calories' | 'protein' | 'carbohydrate' | 'fat', value: string | number) => {
      setIngredient((prevIngredient) => {
        if (field == 'weight' && currentProduct && Number(value)>0) {
          value = Number(value)
          return {
            ...prevIngredient,
            weight: value,
            calories: Math.round(value * currentProduct.calories / 100),
            protein: Math.round(value * currentProduct.protein / 100),
            carbohydrate: Math.round(value * currentProduct.carbohydrate / 100),
            fat: Math.round(value * currentProduct.fat / 100),
          }
        } else {
          return {
            ...prevIngredient,
            [field]:value
          }
        }
      }); 
    
      setValidationError(null);
    };

// get current product from existing products
    const getProduct = async (productName:string) => {
      const productNameExists = productNames?.find(product => product === productName);
      if (productNameExists) {
        const response = await fetchProducts({pageParam:1, queryKey: ['products', productName]})
        const products: Product[] = response.products
        const product = products?.find(product => product.name === productName);
        if (product) {  
          setIngredient((prevIngredient) => ({
              ...prevIngredient,
              name: product.name,
              product:  product.id
          }));  
          setCurrentProduct(product)
          setFilteredSuggestions([])
  
  
          setTimeout(() => {
            if (inputRefs[1].current) {
              inputRefs[1].current.focus();
            }
          }, 10);        
        }     
      }

    }

 
    const handleProductNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.slice(0,1).toUpperCase() + e.target.value.slice(1);

      if (currentProduct) {
        setCurrentProduct(null)
      }

      if (value.startsWith('add "') && value.endsWith('" to my products')) { 
        console.log('condition met')
          setIngredient((prevIngredient) => ({
              ...prevIngredient,
              name: '',  
          }));  

          setCreatingNewProduct(value.slice(5, -16));
          } else {
          setIngredient((prevIngredient) => ({
              ...prevIngredient,
              name: value
          }));
          setCreatingNewProduct(null);
      }

      setFilteredSuggestions([...suggestions, `Add "${value}" to my products`]);
      getProduct(value) 
   };
 

  const handleSubmit = async () => {  
    if (!currentProduct){
      setValidationError('Choose product you want to add to dish')
    }

    if ( ingredient.weight < 1) {
      setValidationError('Weight must be greater than 0.');
      return;
    }  
    if ( ingredient.name == '') {
      setValidationError('Product name cant be empty.');
      return;
    }  

   
    onSuccess(ingredient)

  }
 
  const handleProductSubmit =  (product: Product) => {
    
    setIngredient((prevIngredient) => ({
      ...prevIngredient,
      name: product.name,
      product: product.id
    }));

    setCurrentProduct(product)
  
    setCreatingNewProduct(null); 
    setValidationError(null);
  };

  const handleProductCancel = () => { 
    setCreatingNewProduct(null); 
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
        if (addIngredientButtonRef.current) {
          addIngredientButtonRef.current.click(); 
        }
      } 
    }
  }


  const handleOnCancel = () => {
    setIngredient({
      id: 0,
      name: '',
      weight: 0,
      calories: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0,
      product: 0,
      dish: 0
    })
    onCancel()
  }

 
 
  if (isLoadingProductNames) return <h1>Loading...</h1>;
  if (statusProductNames === 'error') return <h1>{JSON.stringify(errorProductNames)}</h1>;

  return (
    <div className='border rounded m-1 p-3'> 
      <h4 className='text-center'> {ingredientId ? 'Edit ingredient': 'Add ingredient'}</h4> 
        <div>
          <label className='d-flex justify-content-between align-items-center my-2'>
            Product Name:
            <input list='suggestions' type="text" value={ingredient.name || ''} ref={inputRefs[0]}  className='border border-light rounded p-1 mx-2'onFocus={() => handleProductInputFocus()}  onChange={(e) => handleProductNameChange(e)} onKeyDown={(e) => handleKeyDown(e, 1)}  />
            <datalist id='suggestions'>
            {filteredSuggestions.map((product, index) => (
              <option key={index} value={product}/>
            ))}  
            </datalist> 
          </label>   

          {CreatingNewProduct && (
            <div>
              <ProductForm onSubmitSuccess={(product) => handleProductSubmit(product)} onCancel={handleProductCancel} productName={CreatingNewProduct} />
            </div>
          )}
 
          <div>
            <label className='d-flex justify-content-between align-items-center mt-2'>
              Weight (g):
              <input className='border border-light rounded p-1 mx-2' type="number" value={ingredient.weight } ref={inputRefs[1]} onKeyDown={(e) => handleKeyDown(e)}  onChange={(e) => handleIngredientChange('weight', e.target.value)}  onFocus={(e) => e.target.select()} disabled={!currentProduct} />
            </label>

            <label className='d-flex justify-content-between align-items-center mt-2'>
              Calories (g):
              <input type="number" className='border border-light rounded p-1 mx-2' value={ingredient.weight? ingredient.calories : '0'} ref={inputRefs[2]} onChange={(e) => handleIngredientChange('calories', e.target.value)} onKeyDown={(e) => handleKeyDown(e,3)}   onFocus={(e) => e.target.select()} disabled={!currentProduct}/>
            </label>


            <label className='d-flex justify-content-between align-items-center mt-2'>
              Protein (g):
              <input type="number" className='border border-light rounded p-1 mx-2' value={ingredient.weight? ingredient.protein : '0'} ref={inputRefs[3]} onChange={(e) => handleIngredientChange('protein', e.target.value)} onKeyDown={(e) => handleKeyDown(e,4)}   onFocus={(e) => e.target.select()} disabled={!currentProduct}/>
            </label>

            <label className='d-flex justify-content-between align-items-center mt-2'>
              Carbohydrates (g):
              <input type="number" className='border border-light rounded p-1 mx-2' value={ingredient.weight? ingredient.carbohydrate : '0' } ref={inputRefs[4]} onChange={(e) => handleIngredientChange('carbohydrate', e.target.value)} onKeyDown={(e) => handleKeyDown(e,5)}   onFocus={(e) => e.target.select()} disabled={!currentProduct}/>
            </label>

            <label className='d-flex justify-content-between align-items-center my-2'>
              Fat (g):
              <input type="number"  value={ingredient.weight? ingredient.fat : '0' } className='border border-light rounded p-1 mx-2' ref={inputRefs[5]} onChange={(e) => handleIngredientChange('fat', e.target.value)} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} disabled={!currentProduct}/>
            </label>
          </div>
        </div>
 
 
      {validationError && <p style={{ color: 'red' }}>{validationError}</p>} 
      <div className='d-flex justify-content-center'>
        <button type='button' className='btn btn-primary' ref={addIngredientButtonRef} onClick={() => handleSubmit()} > {ingredientId ? 'Edit ingredient' : 'Add ingredient to dish'}</button>
        <button type='button' className='btn btn-danger' onClick={handleOnCancel}>Cancel</button>
      </div>
          
    </div>
  );
};

export default IngredientForm; 