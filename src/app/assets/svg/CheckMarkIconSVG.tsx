import type { FC } from 'react';
import type { SvgIconProps } from '../../../shared/types/svg';

export const CheckMarkIconSVG: FC<SvgIconProps> = (props) => {
  return (
    <svg
      width='16'
      height='11'
      viewBox='0 0 16 11'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M14.6668 1L5.50016 10.1667L1.3335 6'
        stroke='white'
        stroke-width='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
