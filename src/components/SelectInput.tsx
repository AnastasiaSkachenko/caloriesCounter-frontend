import React, { SelectHTMLAttributes } from "react";

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  title: string;
  name: string;
  value?: string | number;
  isRequired?: boolean;
  labelClassName?: string;
  selectClassName?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  title,
  name,
  value,
  isRequired = true,
  onChange,
  labelClassName,
  selectClassName,
  children,
  ...rest
}) => {
  return (
    <label className={`d-flex justify-content-between align-items-center my-2 ${labelClassName}`}>
      {title}
      <select
        className={`form-control w-50 ${selectClassName}`}
        name={name}
        value={value}
        required={isRequired}
        onChange={onChange}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
};

export default SelectInput;
