import { useEffect, useState } from "react";
import { Dish, Product } from "../components/interfaces";
import { baseImageUrl } from "./production";

export const useModalFocus = ( inputRefs: React.RefObject<HTMLInputElement>[], object?: Product| Dish) => {
  useEffect(() => {
    const modalElement = document.getElementById(object ? 'modalEdit' : 'modal');
    const focusOnModalOpen = () => {
      inputRefs[0]?.current?.focus();
    };
    modalElement?.addEventListener('shown.bs.modal', focusOnModalOpen);

    return () => {
      modalElement?.removeEventListener('shown.bs.modal', focusOnModalOpen);
    };
  }, [inputRefs, object]);
};

export const validateForm = (nameExists: boolean, nameState: string, type: 'Dish' | 'Product', current?: Product | Dish) => {
	if (nameExists && (!current || current.name !== nameState)) {
		return { message: `${type} with this name already exists`, valid: false };
	}
	if (nameState === "") {
		return { message: `${type} should have a name.`, valid: false };
	}
	
	return { message: undefined, valid: true };
  };
      


export const useHandleKeyDown = () => {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>, nextRef:React.RefObject<HTMLInputElement> | React.RefObject<HTMLButtonElement> | React.RefObject<HTMLTextAreaElement>, button?: boolean ) => {
		if (e.key === 'Enter') {
			e.preventDefault();
	
			if (nextRef.current) {
				if (button) {
					nextRef.current.click()
				} else {
					nextRef.current.focus();
				}
			} 
		}
	}
	return { handleKeyDown }
}



export const capitalizeString = (string: string) => {
 return string.charAt(0).toUpperCase() + string.slice(1)
}

interface HasMedia {
  media?: (string | File)[]; // now supports both strings and files
}

export const convertObjectToFormData = async <T extends HasMedia>(
  object: T,
  objectMedia: 'dish' | 'product'
): Promise<FormData> => {
  if (!object) {
    console.error('NO OBJECT IN CONVERT FUNCTION');
    return new FormData();
  }

  const formData = new FormData();
  console.log('Object in convert function', object);

  // Handle media (File[] or string[])
  if (Array.isArray(object.media)) {
    for (const [index, mediaItem] of object.media.entries()) {
      if (mediaItem instanceof File) {
        formData.append(`${objectMedia}_media`, mediaItem);
      } else if (typeof mediaItem === 'string' && mediaItem.startsWith('file')) {
        const fileName = mediaItem.split('/').pop() || `image_${index}.jpg`;
        const fileType = fileName.split('.').pop() || 'jpeg';
        const response = await fetch(mediaItem);
        const blob = await response.blob();
        formData.append(
          `${objectMedia}_media`,
          new File([blob], fileName, { type: `image/${fileType}` })
        );
      }
    }
  }

  // Append all other fields except media
  for (const key in object) {
    if (key === 'media') continue; // skip media (already handled)

    const value = object[key];
    if (value === null || value === undefined) continue;

    formData.append(`${objectMedia}_${key}`, String(value));
  }

  return formData;
};

const defaultImage = `${baseImageUrl}/media/dishes/potato.jpg`;

export const getImageSource = (value: string | null | undefined): { uri: string } => {
  if (!value) {
    return { uri: defaultImage };
  }

  // If it's an absolute URL (external image)
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return { uri: value };
  }

  // If it's a relative path from the backend
  return { uri: `${baseImageUrl}${value}` };
};


export const useDebounce = (value: string, delay: number = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};


