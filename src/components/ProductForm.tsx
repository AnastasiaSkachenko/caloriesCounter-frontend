import React, { useState, useEffect, useRef } from 'react'; 
import { useQuery } from '@tanstack/react-query'; 
import { Product } from './interfaces';
import { fetchProducts } from '../utils/caloriesCounter';
import { usePutProduct, useSetProduct } from '../hooks/caloriesCounter';

interface AddProductProps {
  onSubmitSuccess?: (product: Product) => void;
  onCancel?: () => void;  
  product?: Product,
  productName?: string
 }

const ProductForm: React.FC<AddProductProps> = ({ onSubmitSuccess, onCancel, product, productName}) => {
 
  console.log('product', product)
  const {
    status: statusProducts, error: errorProducts, isLoading: isLoadingProducts, refetch: refetchProducts,data: products
  } = useQuery({
    queryKey: ['products' ], 
    queryFn: () =>  fetchProducts()  , 
  });

  const [formState, setFormState] = useState<Product>(product ??{
    id: 0,
    name: productName ?? '',
    image: '',
    calories: 0,
    protein: 0,
    carbohydrate: 0,
    fat: 0
  });

  console.log('formstate', formState, )
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { setProduct } = useSetProduct()
  const { putProduct } = usePutProduct()
 
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

 

 
  useEffect(() => { 
    if (!product && inputRefs[0].current && formState.name == ''  && !validationError) {
      inputRefs[0].current.focus();
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, name?: string) => {
    setSuccessMessage(null);
    const { name: fieldName, value } = e.target;
   
    if (fieldName === "calories" || fieldName === "protein" || fieldName === "carbohydrate" || fieldName === "fat" ) {
      const CurrentNumber = parseFloat(parseFloat(value).toFixed(2))   
      if (isNaN(CurrentNumber) || CurrentNumber === 0) { 
        setValidationError('Please enter a positive number');
      } else {
        setValidationError(null);
      }
    }
   
    if (name) {
      let nameExists = undefined
      nameExists = products?.find(
        (product: Product) => product.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
  

      setFormState({
        ...formState,
        [fieldName]: value.slice(0,1).toUpperCase() + value.slice(1)
      }); 

      if (nameExists && nameExists?.id != product?.id) {   
        setValidationError('Product with this name already exists'); 
        return
      } else {
        setValidationError(null);
      }
    } else {
      setFormState({
        ...formState,
        [fieldName]: value,
      });  
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < inputRefs.length) {
        const nextRef = inputRefs[nextIndex].current;
        if (nextRef) {
          nextRef.focus();
        }
      } else {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { name, image, calories, protein, carbohydrate, fat } = formState;
  
    const nameExists = products?.find(
        (product: Product) => product.name.toLowerCase() === name.toLowerCase()
    );

 
  
    if (nameExists && nameExists?.id != product?.id) {
      setValidationError('Product with this name already exists');
      return; 
    } else {
      setValidationError(null);
    }

    if (product?.id) {
  
      const productCurrent: Product = {
        id: product.id,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        image,
        calories,
        protein,
        carbohydrate,
        fat
      };
    
      putProduct({product:productCurrent})
      if (onSubmitSuccess) {
        onSubmitSuccess(productCurrent) 
      }

    } else {
      const product: Product = {
        id: 0,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        image,
        calories,
        protein,
        carbohydrate,
        fat
      };
    
      console.log(product)
      const returnedProduct = await setProduct({product})
 
      if (onSubmitSuccess) {
        onSubmitSuccess(returnedProduct) 
      }

    }
   
    refetchProducts()
    console.log('products refetched')
  }

  if (isLoadingProducts) return <h1>Loading...</h1>;
  if (statusProducts === 'error') return <h1>{JSON.stringify(errorProducts)}</h1>;

  return (
 
    <div className='modal-body'>
      <label className='form-label create-label my-2'  > Product Name:
      <input className='form-control create-input form-control-sm my-2' ref={inputRefs[0]} type="text"  name="name" value={formState.name} required  
        onChange={(e) => handleInputChange(e, e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, 0)}/>
      </label>
      <hr/>
      <label className='d-flex justify-content-between align-items-center mt-2'  >Calories for 100 g:
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[1]} type="number" step="1" name="calories" value={formState.calories} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, 1)}/>
      </label>
      <label  className='d-flex justify-content-between align-items-center mt-2'> Protein for 100 g: 
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[2]} type="number" step="1"  name="protein" value={formState.protein} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, 1)}/>
      </label>
      <label className='d-flex justify-content-between align-items-center mt-2'  >Carbohydrate for 100 g: 
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[3]} type="number" step="1"   name="carbohydrate" value={formState.carbohydrate} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, 1)}/>
      </label>
      <label className='d-flex justify-content-between align-items-center mt-2'> Fat for 100 g:
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[4]} type="number" step="1"  name="fat" value={formState.fat} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, 1)}/>
      </label>
    
      {validationError && <p className='text-danger'>{validationError}</p>}
      {successMessage && <p>{successMessage}</p>}
      <div className='d-flex justify-content-center'>
        <button className='btn btn-primary p-2'  type="button" onClick={handleSubmit}>Submit</button>
        <button className='btn btn-danger p-2 ' data-bs-dismiss='modal' data-bs-target='#modal' type='button' onClick={onCancel}>Cancel</button>
      </div>
    
    </div>

  );
};

export default ProductForm;
