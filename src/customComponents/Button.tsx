import React, { RefObject } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../styles/styles.scss';
import '../../src/index.css'
import { useNavigate } from "react-router-dom";



const variants = {
  submit: "bg-primary-dark flex-shrink-0 flex-grow-0 border-2 border-primary",
  cancel: "bg-secondary-light ",
  delete: "bg-danger  border-danger-dark border-2",
  edit: "bg-warning  border-warning-dark border-2",
  primary: "bg-black border-2 border-primary",
  transparent: "",
  secondary: "bg-black border-2 border-secondary",
  light: "bg-primary-light bg-opacity-10",
  link: "bg-transparent"
}


const variantsText = {
  submit: "text-white font-semibold",
  cancel: "text-primary-dark font-semibold ",
  delete: "text-white font-semibold",
  edit: " font-semibold",
  primary: "text-white",
  transparent: "",
  secondary: "bg-black text-secondary-light",
  light: "text-white",
  link: "text-white text-decoration-underline"
}

const sizes = {
  smallIcon: "p-1",
  sm: "p-2",
  md: "p-2 px-3",
  lg: "p-3 px-4",
  xl: "p-4 px-10"
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void,
  className?: string,
  classNameText?: string,
  icon?: string,
  text?: string,
  disabled?: boolean,
  classNameIcon?: string,
  variant?: keyof typeof variants,
  size?: keyof typeof sizes,
  pending?: boolean, 
  rounded?: string,
  grow?: boolean,
  link?: string,
  ref?: RefObject<HTMLButtonElement>
}

const Button:React.FC<ButtonProps> = ({
  onClick, 
  className, 
  classNameText, 
  icon, 
  text, 
  disabled, 
  classNameIcon, 
  variant = "primary", 
  size = "md", 
  pending, 
  rounded = '3', 
  grow,
  link,
  ref,
  ...rest
}) => {

  const navigate = useNavigate()

  return (
    <button 
      className={`d-flex flex-row gap-2 items-center  ${variants[variant]} ${sizes[size]} rounded-${rounded}  w-auto ${pending && 'opacity-70'} ${className}`}
      onClick={() =>  link ? navigate(link)  : onClick && onClick()}
      disabled={disabled || pending}
      style={{
        flexShrink: grow ? 0 : 1,
        flexGrow: grow ? 1 : 0,
        width: 'auto',
      }}
      {...rest}
      ref={ref}
    >
      {text && (
        <span className={`${classNameText} ${variantsText[variant]} text-${size} text-center`}>
          {pending ? "Loading..." : text}
        </span>
      )}
        {icon && (
          <div className={classNameIcon}>
            <i className={icon}></i>
          </div>
        )}
    </button>
  );
};

export default Button ;
