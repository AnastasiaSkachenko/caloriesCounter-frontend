import React, { useState, useEffect, useRef } from 'react'; 
import { useQuery } from '@tanstack/react-query'; 
import { Product } from './interfaces';
import { fetchProducts } from '../utils/caloriesCounter';
import {  usePutProduct, useSetProduct } from '../hooks/caloriesCounter';
import '../../styles/style.css';
import '../index.css'


interface ProductFormProps {
  onSubmitSuccess?: (product: Product) => void;
  onCancel?: () => void;  
  product?: Product,
  productName?: string,
 }

const ProductForm: React.FC<ProductFormProps> = ({ onSubmitSuccess, onCancel, product, productName}) => {
  const {
    status: statusProducts, error: errorProducts, isLoading: isLoadingProducts, refetch: refetchProducts,data: products
  } = useQuery({
    queryKey: ['products' ], 
    queryFn: () =>  fetchProducts()  , 
  });

  const [formState, setFormState] = useState<Product>(product ??{
    id: 0, name: productName ?? '', calories: 0, protein: 0, carbohydrate: 0,fat: 0
  });

  const [validation, setValidation] = useState<{message: string | undefined, valid: boolean}>({message: undefined, valid: false})
  const addProductButtonRef = useRef<HTMLButtonElement>(null);
  

  const { setProduct } = useSetProduct()
  const { putProduct } = usePutProduct()
  
 
  const [inputRefs] = useState([
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]);
  
 
 

  useEffect(() => {
    const modalElement = document.getElementById(product ? 'modalEdit' : 'modal');
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
  }, [inputRefs, product]);
      

  useEffect(() => {
    const nameExists = products?.find(
      (productL: Product) => productL.name.trim().toLowerCase() === formState.name.trim().toLowerCase()
    );
    if (nameExists && nameExists.name.toLowerCase() != formState.name.toLowerCase()) {
      setValidation({message:'Product with this name already exists.', valid: false})
      return
    } else {
      setValidation({message: undefined, valid: true})
    }

    if (formState.name == '') {
      setValidation({message: 'Product name is required', valid: false})
    } else {
      setValidation({message: undefined, valid: true})
    }
  }, [formState.name, products])
   

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, name?: string) => {
    const { name: fieldName, value } = e.target;
   
    if (fieldName === "calories" || fieldName === "protein" || fieldName === "carbohydrate" || fieldName === "fat" ) {
      const CurrentNumber = parseFloat(parseFloat(value).toFixed(2))   
      if (isNaN(CurrentNumber) || CurrentNumber === 0) { 
        setValidation({message:'Please enter a positive number', valid: false});
      } else {
        setValidation({message: undefined, valid: true});
      }
    }
   
    if (name) {
      setFormState({
        ...formState,
        [fieldName]: value.slice(0,1).toUpperCase() + value.slice(1)
      }); 
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
  }


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { name, image, calories, protein, carbohydrate, fat } = formState;

    const formData = new FormData()

    if (image && typeof image != 'string') formData.append('image', image)
    formData.append('name', name.charAt(0).toUpperCase() + name.slice(1))
    formData.append('calories', calories.toString())
    formData.append('protein', protein.toString())
    formData.append('carbohydrate', carbohydrate.toString())
    formData.append('fat', fat.toString())

    if (product) {
      putProduct({product: formData, id: formState.id})
      return
    }

    const returnedProduct = await setProduct({product:formData})

    setFormState({    
      id: 0,
      name: productName ?? '',
      calories: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0
    })

    if (onSubmitSuccess) onSubmitSuccess(returnedProduct) 
    
    refetchProducts()
  }

  const handleCancel = () => {
    setFormState({    
      id: 0,
      name: productName ?? '',
      calories: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0
    })
    
    if (onCancel) onCancel()
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
        if (addProductButtonRef.current) {
          addProductButtonRef.current.click(); 
        }
      } 
    }
  }


  if (isLoadingProducts) return <h1>Loading...</h1>;
  if (statusProducts === 'error') return <h1>{JSON.stringify(errorProducts)}</h1>;

  return (
    <div className='modal-body'>
      <label className='form-label create-label my-2'> 
        Product Name:
      <input className='form-control create-input form-control-sm my-2' maxLength={149} ref={inputRefs[0]} type="text"  name="name" value={formState.name} required  
        onChange={(e) => handleInputChange(e, e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, 1)}/>
      </label>
      <label className='form-label create-label my-2'>
        <input className='form-control form-control-file form-control-sm' type='file' name='image' accept='image/png, image/jpg, image/jpeg' onChange={(e) => handleImageChange(e)} />
      </label>
      <hr/>
      <label className='d-flex justify-content-between align-items-center mt-2' >Calories for 100 g:
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[1]} type="number" step="1" name="calories" value={formState.calories} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, 2)}/>
      </label>
      <label  className='d-flex justify-content-between align-items-center mt-2'> Protein for 100 g: 
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[2]} type="number" step="1"  name="protein" value={formState.protein} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, 3)}/>
      </label>
      <label className='d-flex justify-content-between align-items-center mt-2'  >Carbohydrate for 100 g: 
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[3]} type="number" step="1"   name="carbohydrate" value={formState.carbohydrate} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, 4)}/>
      </label>
      <label className='d-flex justify-content-between align-items-center mt-2'> Fat for 100 g:
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[4]} type="number" step="1"  name="fat" value={formState.fat} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e)}/>
      </label>
    
      <div className='d-flex justify-content-center'>
        <div className='tooltip-trigger p-0'>
          {!validation.valid && <span className='tooltip'>{validation.message}</span>}
          <button ref={addProductButtonRef} className='btn btn-primary p-2' data-bs-dismiss='modal' data-bs-target={product ? '#modalEdit' : '#modal'} type="button" onClick={handleSubmit} disabled={!validation.valid}>Submit</button>
        </div>
        <button className='btn btn-danger btn-sm p-2 ' data-bs-dismiss= 'modal' data-bs-target={product ? '#modalEdit' : '#modal'} type='button' onClick={handleCancel}>Cancel</button>
      </div>
    
    </div>
 

  );
};

export default ProductForm;
