import * as Yup from 'yup';
import { IsNameUnique } from './dish';
import { useMemo } from 'react';

		

export const useProductSchema = (editingName?: string) => {
  return useMemo(() => {
    return Yup.object({
      name: Yup.string()
        .required('Product name is required')
        .test(
          'is-unique',
          'Product name must be unique. Even dishes count.',
          async (value) => {
            if (!value) return true;
            const { unique } = await IsNameUnique(value, editingName);
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
        .required('Sugars are required'),
      caffeine: Yup.number()
        .transform((value) => (value === "" || isNaN(value) ? 0 : value))
        .min(0, 'Caffeine must be zero or greater')
        .required('Caffeine is required'),
    });
  }, [editingName]); // schema updates only when editingName changes
};

  

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


export const usePreMadeDishSchema = (editingName?: string) => {
  return useMemo(() => {
    return Yup.object({
      name: Yup.string()
        .required('Dish name is required')
        .test(
          'is-unique',
          'Dish name must be unique. Even products count.',
          async (value) => {
            if (!value) return true;
            const { unique } = await IsNameUnique(value, editingName);
            return unique;
          }
        ),
      portion: Yup.number()
        .transform((value) => {
          if (value === "" || isNaN(value)) {
            return -1;
          }
          return value;
        })
        .positive('Weight must be greater than zero')
        .required('Weight is required'),
    });
  }, [editingName]); // Schema updates only when editingName changes
};

export const useCustomDishSchema = (editingName?: string) => {
  return useMemo(() => {
    return Yup.object({
      name: Yup.string()
        .required('Dish name is required')
        .test(
          'is-unique',
          'Dish name must be unique. Even products count.',
          async (value) => {
            if (!value) return true;
            const { unique } = await IsNameUnique(value, editingName);
            return unique;
          }
        ),
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
    });
  }, [editingName]); // Schema updates only when editingName changes
};
