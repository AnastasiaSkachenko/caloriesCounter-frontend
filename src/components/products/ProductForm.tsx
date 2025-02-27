import React, { useState, useEffect, useRef } from 'react'; 
import { Product } from '../interfaces';
import {  usePutProduct, useSetProduct } from '../../hooks/caloriesCounter';
import useAuth from '../../hooks/useAuth';
import { useHandleKeyDown, useModalFocus } from '../../utils/utils';
import { productSchema } from '../../utils/validation schemes';



interface ProductFormProps {
  onSubmitSuccess?: (product: Product) => void;
  onCancel?: () => void;  
  onError?: (errorMessage: string) => void;
  product?: Product,
  productName?: string,
 }

const ProductForm: React.FC<ProductFormProps> = ({ onSubmitSuccess, onCancel, product, productName, onError}) => {
  const { auth } = useAuth()


  const [formState, setFormState] = useState<Product>(product ??{
    id: 0, name: productName ?? '', calories: 0, protein: 0, carbohydrate: 0,fat: 0, user:   0
  });
  const [validation, setValidation] = useState<{message: string | undefined, valid: boolean}>({message: undefined, valid: false})
  const addProductButtonRef = useRef<HTMLButtonElement>(null);
  

  const { setProduct } = useSetProduct()
  const { putProduct } = usePutProduct()
  const { handleKeyDown } = useHandleKeyDown()

  
 
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

  
  // Custom hook for managing modal focus
  useModalFocus(inputRefs, product);


  useEffect(() => {
    productSchema.validate(formState)
      .then(() => setValidation({ valid: true, message: undefined }))
      .catch((err) => setValidation({ valid: false, message: err.message }));
  }, [formState]);
    
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, name?: string) => {
    const { name: fieldName, value } = e.target;
  
  
    setFormState(prevState => ({
      ...prevState,
      [fieldName]: name ? value.charAt(0).toUpperCase() + value.slice(1) : value,
    }));
  };
  
  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList
    }
    setFormState((prevFormSate) => ({...prevFormSate, image: target.files[0]}))
  }


  const createProduct = async () => {
    const formData = new FormData();
    appendFormData(formData);
  
    const response = await setProduct({ product: formData });
    if (typeof response === 'string') {
      onError?.(response);
      return;
    }
  
    resetForm();
    onSubmitSuccess?.(response);
  };
  
  const updateProduct = async () => {
    const formData = new FormData();
    appendFormData(formData);
  
    const response = await putProduct({ product: formData, id: formState.id });
    if (typeof response === 'string') {
      onError?.(response);
      return;
    }
    resetForm();

  };
  
  const appendFormData = (formData: FormData) => {
    const { name, image, calories, protein, carbohydrate, fat } = formState;
    if (image && typeof image !== 'string') formData.append('image', image);
    formData.append('name', name.charAt(0).toUpperCase() + name.slice(1));
    formData.append('calories', calories.toString());
    formData.append('protein', protein.toString());
    formData.append('carbohydrate', carbohydrate.toString());
    formData.append('fat', fat.toString());
    formData.append('user', (auth.user?.id ?? 0).toString());
  };
  
  const resetForm = () => {
    setFormState({
      id: 0,
      name: productName ?? '',
      calories: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0,
      user: auth.user?.id ?? 0,
    });
  };

  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
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
        <input className='form-control form-control-file form-control-sm' type='file' name='image' accept='image/png, image/jpg, image/jpeg' onChange={(e) => handleImageChange(e)} />
      </label>
      <hr/>
      <label className='d-flex justify-content-between align-items-center mt-2' >Calories for 100 g:
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[1]} type="number" step="1" name="calories" value={formState.calories} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, inputRefs[2])}/>
      </label>
      <label  className='d-flex justify-content-between align-items-center mt-2'> Protein for 100 g: 
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[2]} type="number" step="1"  name="protein" value={formState.protein} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, inputRefs[3])}/>
      </label>
      <label className='d-flex justify-content-between align-items-center mt-2'  >Carbohydrate for 100 g: 
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[3]} type="number" step="1"   name="carbohydrate" value={formState.carbohydrate} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, inputRefs[4])}/>
      </label>
      <label className='d-flex justify-content-between align-items-center mt-2'> Fat for 100 g:
        <input className='border border-light rounded p-2 mx-2' ref={inputRefs[4]} type="number" step="1"  name="fat" value={formState.fat} required onFocus={(e) => e.target.select()}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e, addProductButtonRef)}/>
      </label>
      {!validation.valid && (
        <div className="alert alert-danger mt-3 p-2" role="alert">
          {validation.message}
        </div>
      )}

 
      <div className='d-flex justify-content-center'>
        <button ref={addProductButtonRef} className='btn btn-primary p-2 flex-shrink-0' data-bs-dismiss={productName? '' : 'modal'} data-bs-target={product ? '#modalEdit' : '#modal'} type="button" onClick={handleSubmit} disabled={!validation.valid}>Submit</button>
        <button className='btn btn-danger btn-sm p-2 flex-shrink-0' data-bs-dismiss= { productName ? '':'modal'} data-bs-target={product ? '#modalEdit' : '#modal'} type='button' onClick={handleCancel}>Cancel</button>
      </div>
    
    </div>
 

  );
};

export default ProductForm;
