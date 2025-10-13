import { type FC } from 'react';
import type { SvgIconProps } from '../../../shared/types/svg';

export const CloseIconSVG: FC<SvgIconProps> = (props) => {
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
        d='M11 1L1 11M1 1L11 11'
        stroke='current'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
