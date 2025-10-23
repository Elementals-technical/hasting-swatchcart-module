import React from 'react';

interface ILabelProps {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const Label = ({ text, isActive = false, onClick }: ILabelProps) => {
  const handleLabelClick = () => {
    if (onClick) onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLabelClick();
    }
  };

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={handleLabelClick}
      onKeyDown={handleKeyDown}
      className={`
        flex justify-center items-center max-w-max px-4 py-2 capitalize rounded-full
        font-medium text-sm cursor-pointer transition-all duration-[400ms] ease-in-out
        outline-none focus:ring-2 focus:ring-[var(--main-accent-color)] focus:ring-offset-2
        ${
          isActive
            ? 'bg-[var(--main-accent-color)] text-white hover:brightness-90'
            : 'bg-[var(--label-bg)] hover:brightness-95'
        }
      `}
    >
      {text}
    </div>
  );
};
