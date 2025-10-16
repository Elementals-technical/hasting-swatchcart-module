import type { FC } from 'react';
import type { SvgIconProps } from '../../../shared/types/svg';

export const ArrowIconSVG: FC<SvgIconProps> = (props) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M9.99984 15.8333L4.1665 9.99996M4.1665 9.99996L9.99984 4.16663M4.1665 9.99996H15.8332'
        stroke='current'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
