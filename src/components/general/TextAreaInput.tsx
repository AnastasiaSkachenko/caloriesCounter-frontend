import React, { TextareaHTMLAttributes } from "react";

interface TextareaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  title: string;
  name: string;
  value?: string;
  isRequired?: boolean;
  labelClassName?: string;
  textareaClassName?: string;
}

const TextareaInput: React.FC<TextareaInputProps> = ({
  title,
  name,
  value,
  isRequired = true,
  onChange,
  labelClassName,
  textareaClassName,
  ...rest
}) => {
  return (
    <label className={`d-flex justify-content-between align-items-center my-2 ${labelClassName}`}>
      {title}
      <textarea
        className={`form-control full-length-input form-control-sm my-2 w-75 ${textareaClassName}`}
        name={name}
        value={value}
        required={isRequired}
        onChange={onChange}
        onFocus={(e) => e.target.select()}
        {...rest}
      />
    </label>
  );
};

export default TextareaInput;
