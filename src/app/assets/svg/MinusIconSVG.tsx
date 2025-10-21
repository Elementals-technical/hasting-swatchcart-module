import type { FC } from 'react';
import type { SvgIconProps } from '../../../shared/types/svg';

export const MinusIconSVG: FC<SvgIconProps> = (props) => {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M2.5 6H9.5'
        stroke='current'
        strokeLinecap='round'
        stroke-linejoin='round'
      />
    </svg>
  );
};
