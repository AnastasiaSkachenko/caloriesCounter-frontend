import React from 'react'
import { useHandleKeyDown } from '../utils/utils'


interface CustomInputProps {
  title: string,
  type?: string,
  name: string,
  value?: string | number,
  isRequired?: boolean,
  onChange: (e: (
    React.ChangeEvent<HTMLInputElement> 
    | React.ChangeEvent<HTMLSelectElement>
    | React.ChangeEvent<HTMLTextAreaElement>
  )) => void,
  ref?: (
    React.RefObject<HTMLInputElement> 
    | React.RefObject<HTMLButtonElement> 
    | React.RefObject<HTMLTextAreaElement>),
  step?: string,
  labelClassName?: string,
  inputClassName?: string,
  id?: string,
  children?: React.ReactNode,
}

const CustomInput: React.FC<CustomInputProps> = ({title, type = "string", name, value, isRequired = true, onChange, ref, step = "1", labelClassName, inputClassName, id, children, }) => {
  const { handleKeyDown } = useHandleKeyDown()

  return (
    <label className={`d-flex justify-content-between align-items-center my-2 ${labelClassName}`}>{title}
      {type == "select" ? (
        <select 
          className={`form-control w-50  ${inputClassName}`}
          name={name}
          value={value} 
          onChange={onChange} 
          required
        >
          {children}    
        </select>
      ): type == "textarea" ? (
        <textarea
            className={`form-control full-length-input form-control-sm my-2 w-75 ${inputClassName}`}
            value={value}  
            onChange={onChange} 
            onFocus={(e) => e.target.select()} 
            name={name}
        >
        </textarea>
      ) :(
        <input 
          id={id}
          className={`input ${inputClassName}`} 
          type={type} 
          step={step} 
          name={name} 
          value={value} 
          required={isRequired} 
          onFocus={(e) => e.target.select()}
          onChange={onChange}
          onKeyDown={ref ? (e) => handleKeyDown(e, ref) : undefined}
        />
      )}

    </label>
  )
}

export default CustomInput
