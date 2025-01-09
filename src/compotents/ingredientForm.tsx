import React, { useState, useEffect, useRef, RefObject } from 'react';
import { useQuery } from '@tanstack/react-query';  
import { Product, Ingredient } from './interfaces';
import { fetchIngredient, fetchProductNames, fetchProducts } from '../utils/caloriesCounter';
import ProductForm from './ProductForm';
import '../styles/dish.css'

interface IngredientFormProps {
  onSuccess: (ingredient:Ingredient) => void
  onCancel: () => void,
  ingredientId?: number,
  ingredients: Ingredient[],
  ingredientData?: Ingredient,
}

const IngredientForm: React.FC<IngredientFormProps> = ({onSuccess, onCancel, ingredients, ingredientData, ingredientId }) => { 

    const {
        status: statusProducts, error: errorProducts, isLoading: isLoadingProducts,data: products,  
    } = useQuery({
        queryKey: ['products'], 
        queryFn: () =>  fetchProducts(), 
    });

 

    const {
        status: statusProductNames, error: errorProductNames, isLoading: isLoadingProductNames,data: productNames
    } = useQuery({
        queryKey: ['productNames'], 
        queryFn: () => fetchProductNames(), 
    });

 
 

    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([''])
    const [CreatingNewProduct, setCreatingNewProduct] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string | null>(null)
    const productGrossInput = useRef<HTMLInputElement>(null); 
     
 
    const [ingredient, setIngredient] = useState<Ingredient>(ingredientData??{
      id: 0,
      name: '',
      image: '',
      weight: 0,
      calories: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0,
      dish: 0,
      product: 0
    });

    const [currentProduct, setCurrentProduct] = useState<Product | null>()


  const [usedProducts, setUsedProducts] = useState<string[]>([]) 

    const inputRefs = [
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null)
    ];
  
  

  useEffect(() => {
    const newUsedProducts: string[] = []; 

    ingredients.forEach((ingredient) => {
      const productData = products?.find(product => product.id === ingredient.product);
      if (productData){  
        newUsedProducts.push(productData.name.toLowerCase())
      }
    })
    setUsedProducts([...new Set(newUsedProducts)]); 
    
  }, [products, ingredients]);


  //in case when editing ingredient and there just id send to form
  useEffect(() => { 
    const fetchAndSetTCProduct = async () => {
      if (ingredient.id == 0 && ingredientId) { 
        const fetchedIngredient = await fetchIngredient(ingredientId); 
        setFilteredSuggestions(prevFiltered =>
          prevFiltered.filter(suggestion => suggestion !== fetchedIngredient.name)
        ); 
        setIngredient(fetchedIngredient)
       } 
    };
    fetchAndSetTCProduct();
  }, [ingredient.id, ingredientId]);
  
  
    
    useEffect(()=> {
      if (ingredientId){
        setCreatingNewProduct(false); 

      }
    }, [ingredientId] )
  

 
    const suggestions = [
      ...productNames || []
  ];
      
 

 

 
    const handleProductInputFocus = () => { 
      setCreatingNewProduct(false) 
    };

    const handleIngredientChange = (field: 'weight' | 'calories' | 'protein' | 'carbohydrate' | 'fat', value: string | number) => {
      setIngredient((prevIngredient) => {
        console.log(typeof value)
        if (field == 'weight' && currentProduct) {
          value = Number(value)
          return {
            ...prevIngredient,
            [field]: value,
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
    const getProduct = (productName:string) => {
      const product = products?.find(product => product.name.toLowerCase() === productName);
      if (product) {  
        if (usedProducts.includes(product.name.toLowerCase())){
          setValidationError(`This product is already used in this dish`)
          setIngredient((prevIngredient) => ({
            ...prevIngredient,
            name: '',  
          }));
          setCurrentProduct(null)
          return  
        } else {
          setValidationError(null)
        }

        setIngredient((prevIngredient) => ({
            ...prevIngredient,
            name: product.name,
            product:  product.id
        }));  
        setCurrentProduct(product)
        setFilteredSuggestions([])
        if (productGrossInput.current) { 
          productGrossInput.current.focus();
        }
      }   
    }

 
    const handleProductNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value.toLowerCase();
      if (usedProducts.includes(value)) {
        setValidationError('You cant use this product. It already exists in this dish')
        setIngredient((prevIngredient) => ({
          ...prevIngredient,
          name: '',  
        }));  

        return
      } else {
        setValidationError(null)
      }

      if (value.startsWith('add "') && value.endsWith('" to my products')) { 
          setIngredient((prevIngredient) => ({
              ...prevIngredient,
              name: '',  
          }));  
          setCreatingNewProduct(true);
        } else {
          setIngredient((prevIngredient) => ({
              ...prevIngredient,
              name: value 
          }));
          setCreatingNewProduct(false);
      }
      const filterSuggestions = suggestions.filter(product => product.toLowerCase().startsWith(value));
      const NotUsed = filterSuggestions.filter(product => !usedProducts.includes(product))
  
      if (!NotUsed.includes(value) && !value.startsWith('add "')) {
          NotUsed.push(`Add "${value}" to my products`); 
      } else {
          NotUsed.pop();
      }
      setFilteredSuggestions(NotUsed);
      getProduct(value) 
   };
 

  const handleSubmit = async () => {  
    if ( ingredient.weight < 1) {
      setValidationError('Net must be greater than 0.');
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
      image: product.image
    }));

    setCurrentProduct(product)
  
    setCreatingNewProduct(false); 
    setValidationError(null);
  };

  const handleProductCancel = () => { 
    setCreatingNewProduct(false); 
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
    setIngredient({
      id: 0,
      name: '',
      image: '',
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

 
  if (isLoadingProducts) return <h1>Loading...</h1>;
  if (statusProducts === 'error') return <h1>{JSON.stringify(errorProducts)}</h1>;
 
  if (isLoadingProductNames) return <h1>Loading...</h1>;
  if (statusProductNames === 'error') return <h1>{JSON.stringify(errorProductNames)}</h1>;

  return (
    <div className='form'> 
      <h3> {ingredientId ? 'Edit ingredient': 'Add ingredient'}</h3> 
        <div>
          <label>
            Product Name:
            <input list='suggestions' type="text" value={ingredient.name || ''}  onFocus={() => handleProductInputFocus()}  onChange={(e) => handleProductNameChange(e)} />
            <datalist id='suggestions'>
            {filteredSuggestions.map((product, index) => (
              <option key={index} value={product}/>
            ))}  
            </datalist> 
            {CreatingNewProduct && (
              <ProductForm onSubmitSuccess={(product) => handleProductSubmit(product)} onCancel={handleProductCancel} />
            )}
             
     
          </label>   
          <div>
            <label>
              Weight (g):
              <input type="number" value={ingredient.weight } ref={inputRefs[1]} onChange={(e) => handleIngredientChange('weight', e.target.value)} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} />
            </label>
            <br/>

            <label>
              Calories (g):
              <input type="number" value={ingredient.calories } ref={inputRefs[2]} onChange={(e) => handleIngredientChange('calories', e.target.value)} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} />
            </label>
            <br/>


            <label>
              Protein (g):
              <input type="number" value={ingredient.protein } ref={inputRefs[3]} onChange={(e) => handleIngredientChange('protein', e.target.value)} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} />
            </label>
            <br/>

            <label>
              Carbohydrates (g):
              <input type="number" value={ingredient.carbohydrate } ref={inputRefs[4]} onChange={(e) => handleIngredientChange('carbohydrate', e.target.value)} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} />
            </label>
            <br/>

            <label>
              Fat (g):
              <input type="number" value={ingredient.fat } ref={inputRefs[5]} onChange={(e) => handleIngredientChange('fat', e.target.value)} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} />
            </label>
            <br/>
          </div>
        </div>
 
 
      {validationError && <p style={{ color: 'red' }}>{validationError}</p>} 
      <button type='button' onClick={() => handleSubmit()} > {ingredientId ? 'Edit ingredient' : 'Add ingredient to dish'}</button>
 
      <button type='button' onClick={handleOnCancel}>Cancel</button>
  
    </div>
  );
};

export default IngredientForm; 