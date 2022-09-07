import React, { DOMAttributes } from "react";

export interface IButtonProps {
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  isDisabled?: boolean;
  children?: React.ReactNode;
}

export const useButton = () => {
  const [isDisabled, setIsDisabled] = React.useState(false);
  return {
    isDisabled,
    setIsDisabled,
  };
};

export const Button: React.FC<IButtonProps> = ({
  onClick,
  className = "w-full shadow-md my-4 p-4 bg-sky-100 hover:bg-sky-300",
  isDisabled,
  children,
  ...rest
}) => {
  return (
    <button className={className} onClick={onClick} disabled={isDisabled}>
      {children}
    </button>
  );
};
