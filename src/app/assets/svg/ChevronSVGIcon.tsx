import type { FC } from 'react';
import type { SvgIconProps } from '../../../shared/types/svg';

export const ChevronSVGIcon: FC<SvgIconProps> = (props) => {
  return (
    <svg
      width='7'
      height='12'
      viewBox='0 0 7 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      stroke='currentColor'
      {...props}
    >
      <path
        d='M5.75 0.75L0.75 5.75L5.75 10.75'
        stroke='current'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
