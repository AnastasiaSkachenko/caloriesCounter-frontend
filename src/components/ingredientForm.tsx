import React, { useState, useEffect, useRef, RefObject } from 'react';
import { useQuery } from '@tanstack/react-query';  
import { Product, Ingredient } from './interfaces';
import { fetchIngredient, fetchProductNames, fetchProducts } from '../utils/caloriesCounter';
import ProductForm from './ProductForm';

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
    const [CreatingNewProduct, setCreatingNewProduct] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null)
     
 
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
      if (ingredientId){
        setCreatingNewProduct(null); 

      }
    }, [ingredientId] )
  

 
    const suggestions = [
      ...productNames || []
  ];
      
 
 
    const handleProductInputFocus = () => { 
      setCreatingNewProduct(null) 
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
      }   
    }

 
    const handleProductNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value.trim().toLowerCase();
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

      if (currentProduct) {
        setCurrentProduct(null)
      }

      if (value.startsWith('add "') && value.endsWith('" to my products')) { 
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
      const filterSuggestions = suggestions.filter(product => product.toLowerCase().startsWith(value));
      const NotUsed = filterSuggestions.filter(product => !usedProducts.includes(product))
  
      if (!NotUsed.includes(value) && !value.startsWith('add "')) {
          NotUsed.push(`Add "${value}" to my products`); 
      } else {
          NotUsed.pop();
      }
      setFilteredSuggestions(NotUsed);
      getProduct(value) 
      console.log(currentProduct, 'cp')
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

            <button className="btn btn-primary"  data-bs-toggle='modal' data-bs-target='#modalProduct'>Create dish</button>
            <div className=' modal fade  form p-2 m-2 ' id='modalProduct'> 
              <div className='  modal-dialog modal-dialog-centered' >
                <div className='bg-secondary text-black modal-content'>
                  <h3 className='modal-header'>Create new dish</h3>
                  {CreatingNewProduct && (
                    <ProductForm onSubmitSuccess={(product) => handleProductSubmit(product)} onCancel={handleProductCancel} productName={CreatingNewProduct} />
                  )}
                </div>
              </div>
            </div>

             
     
          </label>   
          <div>
            <label>
              Weight (g):
              <input type="number" value={ingredient.weight } ref={inputRefs[1]} onChange={(e) => handleIngredientChange('weight', e.target.value)} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} disabled={!currentProduct} />
            </label>
            <br/>

            <label>
              Calories (g):
              <input type="number" value={ingredient.weight? ingredient.calories : '0'} ref={inputRefs[2]} onChange={(e) => handleIngredientChange('calories', e.target.value)} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} disabled={!currentProduct}/>
            </label>
            <br/>


            <label>
              Protein (g):
              <input type="number" value={ingredient.weight? ingredient.protein : '0'} ref={inputRefs[3]} onChange={(e) => handleIngredientChange('protein', e.target.value)} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} disabled={!currentProduct}/>
            </label>
            <br/>

            <label>
              Carbohydrates (g):
              <input type="number" value={ingredient.weight? ingredient.carbohydrate : '0' } ref={inputRefs[4]} onChange={(e) => handleIngredientChange('carbohydrate', e.target.value)} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} disabled={!currentProduct}/>
            </label>
            <br/>

            <label>
              Fat (g):
              <input type="number" value={ingredient.weight? ingredient.fat : '0' } ref={inputRefs[5]} onChange={(e) => handleIngredientChange('fat', e.target.value)} onKeyDown={(e) => handleKeyDown(e)}   onFocus={(e) => e.target.select()} disabled={!currentProduct}/>
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