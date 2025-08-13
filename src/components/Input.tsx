import React, { InputHTMLAttributes, RefObject } from "react";
import { useHandleKeyDown } from "../utils/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
  name?: string;
  value?: string | number;
  isRequired?: boolean;
  refObjNext?: RefObject<HTMLInputElement> | RefObject<HTMLButtonElement>;
  step?: string;
  labelClassName?: string;
  inputClassName?: string;
  refObj?: RefObject<HTMLInputElement>
}

const Input: React.FC<InputProps> = ({
  title,
  type = "text",
  name = title,
  value,
  isRequired = true,
  onChange,
  refObjNext,
  step = "1",
  labelClassName,
  inputClassName,
  id,
  refObj,
  ...rest
}) => {
  const { handleKeyDown } = useHandleKeyDown();

  return (
    <label className={`d-flex justify-content-between align-items-center my-2 ${labelClassName ?? ""}`}>
      {title}
      <input
        id={id}
        className={`input ${inputClassName ?? ""}`}
        ref={refObj}
        type={type}
        step={step}
        name={name}
        value={value}
        required={isRequired}
        onFocus={(e) => e.target.select()}
        onChange={onChange}
        onKeyDown={refObjNext ? (e) => handleKeyDown(e, refObjNext) : undefined}
        {...rest}
      />
    </label>
  );
};

export default Input;
