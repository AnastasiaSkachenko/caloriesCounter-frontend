import React, { InputHTMLAttributes } from "react";

interface SwitchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
  name: string;
  isRequired?: boolean;
  labelClassName?: string;
  inputClassName?: string;
}

const SwitchInput: React.FC<SwitchInputProps> = ({
  title,
  name,
  isRequired = false,
  onChange,
  labelClassName,
  inputClassName,
  ...rest
}) => {
  return (
    <label className={`d-flex justify-content-between align-items-center my-2 ${labelClassName}`}>
      {title}
      <input
        type="checkbox"
        className={`form-check-input ${inputClassName}`}
        name={name}
        required={isRequired}
        onChange={onChange}
        {...rest}
      />
    </label>
  );
};

export default SwitchInput;
