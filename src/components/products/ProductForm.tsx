import React, { useState, useEffect, useRef } from 'react'; 
import { MacroNitrient, Product } from '../interfaces';
import {  usePutProduct, useSetProduct } from '../../hooks/caloriesCounter';
import useAuth from '../../hooks/useAuth';
import { convertObjectToFormData, useHandleKeyDown, useModalFocus } from '../../utils/utils';
import { useProductSchema } from '../../utils/validation schemes';
import { v4 as uuidv4 } from 'uuid';
import Button from '../../customComponents/Button';

const nutritions: { title: string; value: MacroNitrient }[] = [
  {title: "Calories", value: "calories"},
  {title: "Protein", value: "protein"},
  {title: "Carbs", value: "carbs"},
  {title: "Fat", value: "fat"},
  {title: "Fiber", value: "fiber"},
  {title: "Sugars", value: "sugars"},
  {title: "Caffeine", value: "caffeine"}
]


interface ProductFormProps {
  onSubmitSuccess?: (product: Product) => void;
  onCancel?: () => void;  
  onError?: (errorMessage: string) => void;
  product?: Product,
  productName?: string,
 }
///////////////////////// now use carbs instead of carbohydrate
const ProductForm: React.FC<ProductFormProps> = ({ onSubmitSuccess, onCancel, product, productName, onError}) => {
  const { auth } = useAuth()
  console.log(auth.user, 'auth')


  const [formState, setFormState] = useState<Product>(product ??{
    id: uuidv4() , name: productName ?? '', calories: 0, protein: 0, carbs: 0,fat: 0, user: auth.user?.id ?? 0, sugars: 0, fiber: 0, caffeine: 0
  });
  const [validation, setValidation] = useState<{message: string | undefined, valid: boolean}>({message: undefined, valid: false})
  const addProductButtonRef = useRef<HTMLButtonElement>(null);
  
useEffect(() => {
  if (auth.user && !product && auth.user.id > 0) {
    setFormState(prev => ({
      ...prev,
      user: auth.user?.id ?? 0
    }));
  }
}, [auth.user, product]);

  const { setProduct } = useSetProduct()
  const { putProduct } = usePutProduct()
  const { handleKeyDown } = useHandleKeyDown()
  const validationSchema = useProductSchema(product && product.name)


  
 
  const [inputRefs] = useState([
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]);

  useEffect(() => {
    if (product) {
      setFormState(product);
    }
  }, [product]);

  
  useEffect(() => {
    if (productName) {
      if (inputRefs[1].current) {
        inputRefs[1].current.focus()
      }
    }
  }, [productName, inputRefs]);


  // Custom hook for managing modal focus
  useModalFocus(inputRefs, product);


  useEffect(() => {
    validationSchema.validate(formState)
      .then(() => setValidation({ valid: true, message: undefined }))
      .catch((err) => setValidation({ valid: false, message: err.message }));
  }, [formState, product, validationSchema]);
    
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, name?: string) => {
    const { name: fieldName, value } = e.target;
  
  
    setFormState(prevState => ({
      ...prevState,
      [fieldName]: name ? value.charAt(0).toUpperCase() + value.slice(1) : value,
    }));
  };
  
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & { files: FileList };

    if (target.files) {
      const filesArray = Array.from(target.files); // Convert FileList to array
      setFormState((prevFormState) => ({
        ...prevFormState,
        media: [...(prevFormState.media || []), ...filesArray], // Append new files
      }));
    }
  };

  const createProduct = async () => {
    const formData = await convertObjectToFormData(formState, "product")
  
    const response = await setProduct({ product: formData });
    if (typeof response === 'string') {
      onError?.(response);
      return;
    }
  
    resetForm();
    onSubmitSuccess?.(response);
  };
  
  const updateProduct = async () => {
    const formData = await convertObjectToFormData(formState, "product")
  
    const response = await putProduct({ product: formData, id: formState.id });
    if (typeof response === 'string') {
      onError?.(response);
      return;
    }
    resetForm();

  };
  
  
  const resetForm = () => {
    setFormState({
      id: uuidv4(),
      name: productName ?? '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      user: auth.user?.id ?? 0,
      fiber: 0,
      sugars: 0,
      caffeine: 0
    });
  };

  

  const handleSubmit = async () => {
    try {
      if (product) {
        await updateProduct();
      } else {
        await createProduct();
      }
    } catch {
      onError?.("An error occurred. Please try again.");
    }
  };
  
  const handleCancel = () => {
    resetForm()
    if (onCancel) onCancel()
  }

  return (
    <div className='modal-body'>
      <label className='form-label full-length-label my-2'> 
        Product Name:
      <input className='form-control full-length-input form-control-sm my-2' maxLength={149} ref={inputRefs[0]} type="text"  name="name" value={formState.name} required  
        onChange={(e) => handleInputChange(e, e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, inputRefs[1])}/>
      </label>
      <label className='form-label full-length-label my-2'>
        <input 
          className="form-control form-control-file form-control-sm"  
          type="file" id="formFileMultiple" 
          onChange={(e) => handleMediaChange(e)} multiple 
          />
      </label>
      {nutritions.map((nutrition, index) => (
        <label key={index} className='d-flex justify-content-between align-items-center mt-2' >{nutrition.title} for 100 g:
          <input className='input border border-light rounded p-1 w-25' ref={inputRefs[index + 1]} type="number" step="1" name={nutrition.value} value={formState[nutrition.value]} required onFocus={(e) => e.target.select()}
            onChange={(e) => handleInputChange(e)}
            onKeyDown={(e) => handleKeyDown(e, inputRefs[index + 2])}/>
        </label>
      ))}
      
      {!validation.valid && (
        <div className="alert alert-dark text-black mt-2 p-1 text-center" role="alert">
          {validation.message}
        </div>
      )}

      <div className='d-flex justify-content-center gap-2'>
        <Button text='Submit' variant='submit' ref={addProductButtonRef} data-bs-dismiss={productName? '' : 'modal'} data-bs-target={product ? '#modalEdit' : '#modal'} type="button" onClick={handleSubmit} disabled={!validation.valid}/>
        <Button text='Cancel' variant='cancel' data-bs-dismiss= { productName ? '':'modal'} data-bs-target={product ? '#modalEdit' : '#modal'} type='button' onClick={handleCancel}/>
      </div>
    
    </div>
 

  );
};

export default ProductForm;
