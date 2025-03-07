import React, { useState, useEffect, useRef, useCallback } from 'react';
import {  useQuery } from '@tanstack/react-query';  
import { Product, Ingredient } from '../interfaces';
import {  fetchProducts, getProductNames } from '../../utils/product'
import ProductForm from '../products/ProductForm';
import { useHandleKeyDown } from '../../utils/utils';
import { IngredientSchema } from '../../utils/validation schemes';
 
interface IngredientFormProps {
  onSuccess: (ingredient:Ingredient) => void
  onCancel: () => void,
  ingredientData?: Ingredient,
}

const IngredientForm: React.FC<IngredientFormProps> = ({onSuccess, onCancel, ingredientData }) => { 

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
  const [validation, setValidation] = useState<{message: string | undefined, valid: boolean}>({message: undefined, valid: false})
  const addIngredientButtonRef = useRef<HTMLButtonElement>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>()
  const [focus, setFocus] = useState(true)
  const suggestions = [
    ...productNames || []
  ];

  const { handleKeyDown } = useHandleKeyDown()

  const [inputRefs] = useState([
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]);


  const getProduct = async (productName: string) => {
    const productNameExists = productNames?.find(product => product === productName);
    if (productNameExists || ingredientData) {


      const response = await fetchProducts({ pageParam: 1, queryKey: ['products', productName] });
      const products: Product[] = response.products;
      const product = products?.find(product => product.name === productName);
      if (product) {
        setIngredient((prevIngredient) => ({ ...prevIngredient, name: product.name, product: product.id }));
        setCurrentProduct(product);
        setFilteredSuggestions([]);
        setTimeout(() => {
          if (inputRefs[1].current) {
            inputRefs[1].current.focus();
          }
        }, 10);
      }
    }
  }; 
  
  useEffect(() => {
    if (inputRefs[0].current && focus) {
      inputRefs[0].current.focus();
    }
  }, [inputRefs, focus]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (ingredientData?.name) {
        console.log('calledddd', ingredientData.name)
        await getProduct(ingredientData.name);
        console.log('loaded')
      }
    };

    fetchProduct(); 
    console.log(currentProduct, 'current product')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredientData?.name, currentProduct]);

  useEffect(() => {
    if (!currentProduct) {
      // If currentProduct is undefined, set the validation state accordingly
      setValidation({ valid: false, message: 'Choose product first.' });
      return;
    }
  
    // Proceed with IngredientSchema validation if currentProduct is defined
    IngredientSchema.validate(ingredient)
      .then(() => setValidation({ valid: true, message: undefined }))
      .catch((err) => setValidation({ valid: false, message: err.message }));
  }, [ingredient, currentProduct]);    



  const handleProductInputFocus = useCallback(() => {
    setCreatingNewProduct(null);
    setFocus(false);
  }, []);
  
  const handleIngredientChange = useCallback(
    (field: 'weight' | 'calories' | 'protein' | 'carbohydrate' | 'fat', value: string | number) => {
      setIngredient((prevIngredient) => {
        if (field === 'weight' && currentProduct && Number(value) > 0) {
          value = Number(value);
          return {
            ...prevIngredient,
            weight: value,
            calories: Math.round(value * currentProduct.calories / 100),
            protein: Math.round(value * currentProduct.protein / 100),
            carbohydrate: Math.round(value * currentProduct.carbohydrate / 100),
            fat: Math.round(value * currentProduct.fat / 100),
          };
        } else {
          return {
            ...prevIngredient,
            [field]: value,
          };
        }
      });
    },
    [currentProduct]
  );
  
  const handleProductNameChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.slice(0, 1).toUpperCase() + e.target.value.slice(1);
  
      if (currentProduct) {
        setCurrentProduct(null);
      }
  
      if (value.startsWith('Add "') && value.endsWith('" to my products')) {
        setIngredient((prevIngredient) => ({
          ...prevIngredient,
          name: '',
        }));
        setFilteredSuggestions([]);
        setCreatingNewProduct(value.slice(5, -16));
        return;
      } else {
        setIngredient((prevIngredient) => ({
          ...prevIngredient,
          name: value,
        }));
        setCreatingNewProduct(null);
      }
  
      setFilteredSuggestions([...suggestions, `Add "${value}" to my products`]);
      getProduct(value);
    },
    [currentProduct, suggestions]
  );

 
 

  const handleSubmit = async () => {  




   
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
    setFilteredSuggestions(prev => ([...prev, product.name]))
  };

  const handleProductCancel = () => { 
    setCreatingNewProduct(null); 
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
      <h4 className='text-center'> {ingredientData ? 'Edit ingredient': 'Add ingredient'}</h4> 
      <div>
        <label className='d-flex justify-content-between align-items-center my-2'>
          Product Name:
          <input list='suggestions' type="text" value={ingredient.name || ''} ref={inputRefs[0]}  className='border border-light rounded p-1 mx-2'onFocus={() => handleProductInputFocus()}  onChange={(e) => handleProductNameChange(e)} onKeyDown={(e) => handleKeyDown(e, inputRefs[1])}  />
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
            <input className='border border-light rounded p-1 mx-2' type="number" value={ingredient.weight } ref={inputRefs[1]} onKeyDown={(e) => handleKeyDown(e, addIngredientButtonRef, true)}  onChange={(e) => handleIngredientChange('weight', e.target.value)}  onFocus={(e) => e.target.select()} disabled={!currentProduct} />
          </label>

          <p className='pt-3 pb-1'>Calories: {ingredient.calories}, Protein: {ingredient.protein}, Carbs: {ingredient.carbohydrate}, Fat: {ingredient.fat}</p>

        </div>
      </div>

      {!validation.valid && (
        <div className="alert alert-danger mt-3 p-2" role="alert">
          {validation.message}
        </div>
      )}

      <div className='d-flex justify-content-center'>
        <button type='button' className='btn btn-primary' ref={addIngredientButtonRef} onClick={() => handleSubmit()} disabled={!validation.valid} > {ingredientData ? 'Edit ingredient' : 'Add ingredient to dish'}</button>
        <button type='button' className='btn btn-danger' onClick={handleOnCancel}>Cancel</button>
      </div>
          
    </div>
  );
};

export default IngredientForm; 