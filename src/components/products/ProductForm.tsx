import React, { useState, useEffect, useRef } from 'react'; 
import { MacroNutrient, Product } from '../interfaces';
import useAuth from '../../hooks/useAuth';
import { convertObjectToFormData, useModalFocus } from '../../utils/utils';
import { useProductSchema } from '../../utils/validationSchemes';
import { v4 as uuidv4 } from 'uuid';
import Button from '../../customComponents/Button';
import Input from '../general/Input';
import { ProductFormProps } from '../props';
import MediaPicker from '../general/mediaPicker';
import { useProductMutations } from '../../hooks/mutations/products';

const nutritions: { title: string; value: MacroNutrient }[] = [
  {title: "Calories", value: "calories"},
  {title: "Protein", value: "protein"},
  {title: "Carbs", value: "carbs"},
  {title: "Sugars", value: "sugars"},
  {title: "Fat", value: "fat"},
  {title: "Fiber", value: "fiber"},
  {title: "Caffeine", value: "caffeine"}
]


const ProductForm: React.FC<ProductFormProps> = ({ onSubmitSuccess, onCancel, product, productName, onError}) => {
  const { auth } = useAuth()

  const [formState, setFormState] = useState<Product>(product ?? {
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

  const { setProduct, putProduct } = useProductMutations()

  const validationSchema = useProductSchema(product && product.name)
 
  const [inputRefs] = useState([
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]);

  // ensure that if edit mode correct data is pasted to form state
  useEffect(() => {
    if (product) {
      setFormState(product);
    }
  }, [product]);

  // ensures that when form is open first field is focused  
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
      <Input
        title='Product Name:'
        maxLength={149}
        inputClassName='w-75'
        refObj={inputRefs[0]}
        type='text'
        name='name'
        value={formState.name}
        required
        onChange={(e) => handleInputChange(e, e.target.value)}
        refObjNext={inputRefs[1]}
      />
      <MediaPicker media={formState.media} mediaChange={(media) => setFormState(prev => ({...prev, media}))} setMediaToDelete={(media) => setFormState(prev => ({...prev, media_to_delete: media}))} /> 
      {nutritions.map((nutrition, index) => (
        <Input
          key={index}
          title={`${nutrition.title} for 100 g:`}
          refObj={inputRefs[index + 1]}
          type='number'
          step='1'
          name={nutrition.value}
          value={formState[nutrition.value]}
          onChange={(e) => handleInputChange(e)}
          refObjNext={index == nutritions.length - 1 ? addProductButtonRef : inputRefs[index + 2]}
          required
        />
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