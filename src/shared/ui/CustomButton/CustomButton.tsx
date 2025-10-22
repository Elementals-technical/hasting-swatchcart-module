import React from 'react';

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  ...rest
}) => {
  const baseStyles =
    'w-full bg-[var(--main-accent-color)] text-white py-3 rounded-full font-bold cursor-pointer';

  return (
    <button className={`${baseStyles} `} {...rest}>
      {children}
    </button>
  );
};
