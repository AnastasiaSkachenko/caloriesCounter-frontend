import * as Yup from 'yup';
import { IsNameUnique } from './dish';

		
		
export const productSchema = Yup.object({
	name: Yup.string()
		.required('Product name is required')
		.test('is-unique', 'Product name must be unique', async (value) => {
			if (!value) return true; // Skip validation if the name is not provided
			const { unique } = await IsNameUnique(value); // Call the function to check uniqueness
			if (!unique) return false;  // If not unique, return the error message
			return true; // If unique, validation passes
		}),
		calories: Yup.number()
		.transform((value) => {
			// Handle empty string and other non-numeric values
			if (value === "" || isNaN(value)) {
				return -1; // Set to 0 if the value is empty or NaN
			}
			return value;
		})
		.min(0, 'Calories must be zero or greater')
		.required('Calories are required'),
	protein: Yup.number()
		.transform((value) => {
			if (value === "" || isNaN(value)) {
				return -1; // Set to 0 if the value is empty or NaN
			}
			return value;
		})
		.min(0, 'Protein must be zero or greater')
		.required('Protein is required'),
	carbohydrate: Yup.number()
		.transform((value) => {
			if (value === "" || isNaN(value)) {
				return -1; // Set to 0 if the value is empty or NaN
			}
			return value;
		})
		.min(0, 'Carbohydrates must be zero or greater')
		.required('Carbohydrates are required'),
	fat: Yup.number()
		.transform((value) => {
			if (value === "" || isNaN(value)) {
				return -1; // Set to 0 if the value is empty or NaN
			}
			return value;
		})
		.min(0, 'Fat must be zero or greater')
		.required('Fat is required'),
})  
		


export const IngredientSchema = Yup.object({
	name: Yup.string().required('Product name is required'),
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


export const PreMadeDishSchema = Yup.object({
	name: Yup.string()
		.required('Product name is required')
		.test('is-unique', 'Dish name must be unique', async (value) => {
			if (!value) return true; // Skip validation if the name is not provided
			const { unique } = await IsNameUnique(value); // Call the function to check uniqueness
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



export const CustomDishSchema = Yup.object({
	name: Yup.string()
		.required('Product name is required')
		.test('is-unique', 'Dish name must be unique', async (value) => {
			if (!value) return true; // Skip validation if the name is not provided
			const { unique } = await IsNameUnique(value); // Call the function to check uniqueness
			if (!unique) return false;  // If not unique, return the error message
			return true; // If unique, validation passes
		}),
	portions: Yup.number()
	.transform((value) => {
		if (value === "" || isNaN(value)) {
			return -1; // Set to 0 if the value is empty or NaN
		}
		return value;
	})
	.positive('Number of portions must be greater than zero')
	.required('Number of portions is required'),
})  

		
