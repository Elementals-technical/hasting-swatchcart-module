import React from 'react';

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  disabled,
  ...rest
}) => {
  const baseStyles =
    'w-full bg-[var(--main-accent-color)] text-white py-3 rounded-full font-bold transition-colors duration-300';
  const activeStyles = 'cursor-pointer hover:opacity-90';
  const disableStyles =
    'bg-gray-400 text-gray-200 cursor-not-allowed opacity-70';

  return (
    <button
      className={`${baseStyles} ${disabled ? disableStyles : activeStyles}`}
      {...rest}
    >
      {children}
    </button>
  );
};
