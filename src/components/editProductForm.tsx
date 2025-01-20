import React, { useState, useEffect, useRef } from 'react'; 
import { useQuery } from '@tanstack/react-query'; 
import { Product } from './interfaces';
import { fetchProducts } from '../utils/caloriesCounter';
import { usePutProduct} from '../hooks/caloriesCounter';
import '../../styles/style.css';
import '../index.css'



interface EditProductProps {
  onSubmitSuccess?: (product: Product) => void;
  onCancel?: () => void;  
  product: Product,
 }

const EditProductForm: React.FC<EditProductProps> = ({ onSubmitSuccess, onCancel, product}) => {
 
  console.log('product', product)
  const {
    status: statusProducts, error: errorProducts, isLoading: isLoadingProducts, refetch: refetchProducts,data: products
  } = useQuery({
    queryKey: ['products' ], 
    queryFn: () =>  fetchProducts()  , 
  });

    const [formState, setFormState] = useState<Product>(product ??{
      id: 0,
      name:  '',
      calories: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0
    });
  

  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null)
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

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList
    }
    setFormState((prevFormSate) => ({...prevFormSate, image: target.files[0]}))
    const file = new FileReader()
    file.onload = function () {
      setPreview(file.result)
    }
    file.readAsDataURL(target.files[0])
    console.log(formState)
  }
  

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

    const formData = new FormData()
    if (typeof image == 'object') formData.append('image', image)
      formData.append('id', product.id.toString())
      formData.append('name', name.charAt(0).toUpperCase() + name.slice(1))
      formData.append('calories', calories.toString())
      formData.append('protein', protein.toString())
      formData.append('carbohydrate', carbohydrate.toString())
      formData.append('fat', fat.toString())

    putProduct({product:formData, id: product.id})
    if (onSubmitSuccess) {
      onSubmitSuccess({...formState, name: name.slice(0,1).toUpperCase() + name.slice(1)}) 
    }

   
    refetchProducts()
    console.log('products refetched')
  }

  if (isLoadingProducts) return <h1>Loading...</h1>;
  if (statusProducts === 'error') return <h1>{JSON.stringify(errorProducts)}</h1>;

  return (
    <div className='px-3' >
      <h3 className='text-center'>Edit product</h3>
      <label className='form-label my-2 d-block' > Product Name:
      <input className='form-control form-control-sm my-2'  ref={inputRefs[0]} type="text"  name="name" value={formState.name} required  
        onChange={(e) => handleInputChange(e, e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, 0)}/>
      </label>
      <label className='form-label create-label my-2'>
        <input type='file' name='image' accept='image/png, image/jpg, image/jpeg' onChange={(e) => handleImageChange(e)} />
        <img className='m-1' style={{width: '80px'}} src={ 
          preview
          ? (typeof preview == 'string' ? preview: undefined )
          : typeof formState.image === "string" // Check if the current value is a string
          ? formState.image // If it's a string, use it as the src
          : 'products/food.jpg'
        }
 />
      </label>

      <hr/>
      <label className='d-flex justify-content-between align-items-center mt-2'  >
        Calories for 100 g:
      <input className='border border-light rounded p-2 mx-2' ref={inputRefs[1]} type="number" step="1" name="calories" value={formState.calories} required onFocus={(e) => e.target.select()}
        onChange={(e) => handleInputChange(e)}
        onKeyDown={(e) => handleKeyDown(e, 1)}/>
      </label>
      <label  className='d-flex justify-content-between align-items-center mt-2'> 
        Protein for 100 g: 
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[2]} type="number" step="1"  name="protein" value={formState.protein} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, 1)}/>
      </label>
      <label className='d-flex justify-content-between align-items-center mt-2'  >
        Carbohydrate for 100 g: 
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[3]} type="number" step="1"   name="carbohydrate" value={formState.carbohydrate} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, 1)}/>
      </label>
      <label className='d-flex justify-content-between align-items-center mt-2'> 
        Fat for 100 g:
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

export default EditProductForm;
