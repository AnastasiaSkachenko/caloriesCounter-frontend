import { useEffect, useState } from "react";
import { Dish, Product } from "../components/interfaces";

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
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextRef:React.RefObject<HTMLInputElement> | React.RefObject<HTMLButtonElement>, button?: boolean ) => {
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


