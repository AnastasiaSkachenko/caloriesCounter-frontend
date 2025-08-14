import * as Yup from 'yup';
import { IsNameUnique } from '../requests/dish';
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
  }, [editingName]);
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


export const activitySchema = Yup.object({
  activity_type: Yup.string()
    .oneOf([
    'workout',
    'tabata',
    'run',
    'walk_time',
    'walk_steps',
    'interval_run',
    'custom',
    'volleyball',
    'jumping',
    'stretching',
    'home_chores',
    "work_bk"
    ])
    .required('Please select a valid activity type'), // Custom error message
  
  duration_minutes: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .min(1, 'Duration must be at least 1 minute')
    .when('activity_type', {
    is: (type: string) => type !== 'walk_steps',
    then: (schema) => schema.required('Please provide the duration for your activity'),
    }),  
  steps: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .min(1, 'Steps must be at least 1')
    .when('activity_type', {
    is: 'walk_steps',
    then: (schema) => schema.required('Please enter the number of steps'),
    otherwise: (schema) => schema.optional(),
    }),
  
  distance_km: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .min(0.1, 'Distance must be at least 0.1 km aaa')
    .optional(),
  
  intensity: Yup.number()
    .min(1, 'Intensity must be between 1 and 5')
    .max(5, 'Intensity must be between 1 and 5')
    .required('Intencity level is required'),

  timestamp: Yup.string().required('Time is required')
});
