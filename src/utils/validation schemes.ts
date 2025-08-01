import * as Yup from 'yup';
import { IsNameUnique } from './dish';

		
		
export const productSchema = (editingName?: string) =>
	Yup.object({
	  name: Yup.string()
		.required('Product name is required')
		.test(
		  'is-unique',
		  'Product name must be unique. Even dishes count.',
		  async (value) => {
			if (!value) return true; // Skip validation if the name is not provided
			const { unique } = await IsNameUnique(value, editingName); // Pass editing name
			return unique;
		  }
		),
	  calories: Yup.number()
		.transform((value) => (value === "" || isNaN(value) ? 0 : value))
		.min(0, 'Calories must be zero or greater')
		.required('Calories are required'),
	  protein: Yup.number()
		.transform((value) => (value === "" || isNaN(value) ? 0 : value))
		.min(0, 'Protein must be zero or greater')
		.required('Protein is required'),
	  carbs: Yup.number()
		.transform((value) => (value === "" || isNaN(value) ? 0 : value))
		.min(0, 'Carbohydrates must be zero or greater')
		.required('Carbohydrates are required'),
	  fat: Yup.number()
		.transform((value) => (value === "" || isNaN(value) ? 0 : value))
		.min(0, 'Fat must be zero or greater')
		.required('Fat is required'),
	    fiber: Yup.number()
		.transform((value) => (value === "" || isNaN(value) ? 0 : value))
		.min(0, 'Fiber must be zero or greater')
		.required('Fiber is required'),
		sugars: Yup.number()
		.transform((value) => (value === "" || isNaN(value) ? 0 : value))
		.min(0, 'Sugars must be zero or greater')
		.required('Sugars is required'),
		caffeine: Yup.number()
		.transform((value) => (value === "" || isNaN(value) ? 0 : value))
		.min(0, 'Caffeine must be zero or greater')
		.required('Caffeine is required'),

	});
  

export const IngredientSchema = Yup.object({
	name: Yup.string().required('Ingredient name is required'),
	weight: Yup.number()
	.transform((value) => {
		if (value === "" || isNaN(value)) {
			return -1; // Set to 0 if the value is empty or NaN
		}
		return value;
	})
	.positive('Weight must be greater than zero')
	.required('Weight is required'),
})


export const preMadeDishSchema = (editingName?: string) => Yup.object({
	name: Yup.string()
		.required('Dish name is required')
		.test('is-unique', 'Dish name must be unique. Even products count.', async (value) => {
			if (!value) return true; // Skip validation if the name is not provided
			const { unique } = await IsNameUnique(value, editingName); // Call the function to check uniqueness
			if (!unique) return false;  // If not unique, return the error message
			return true; // If unique, validation passes
		}),
	portion: Yup.number()
	.transform((value) => {
		if (value === "" || isNaN(value)) {
			return -1; // Set to 0 if the value is empty or NaN
		}
		return value;
	})
	.positive('Weight must be greater than zero')
	.required('Weight is required'),
})  



export const customDishSchema = (editingName?: string) => 
	Yup.object({
	name: Yup.string()
		.required('Dish name is required')
		.test('is-unique', 'Dish name must be unique. Even products count.', async (value) => {
			if (!value) return true; // Skip validation if the name is not provided
			const { unique } = await IsNameUnique(value, editingName); // Call the function to check uniqueness
			if (!unique) return false;  // If not unique, return the error message
			return true; // If unique, validation passes
		}),
	portions: Yup.number()
	.transform((value) => {
		if (value === "" || isNaN(value)) {
			return -1; 
		}
		return value;
	})
	.positive('Number of portions must be greater than zero')
	.required('Number of portions is required'),
	weight_of_ready_product: Yup.number()
	.transform((value) => {
		if (value === "" || isNaN(value)) {
			return -1; 
		}
		return value;
	})
	.positive('Weight of ready dish must be greater than zero')
	.required('Weight of ready dish is required'),

})  

		
