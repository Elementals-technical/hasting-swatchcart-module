import React from 'react';

interface ILoaderProps {
  size?: number | string;
  trackClassName?: string;
  accentClassName?: string;
  className?: string;
}

export const Loader: React.FC<ILoaderProps> = ({
  size = 80,
  trackClassName = 'text-gray-200',
  accentClassName = 'text-amber-700',
  className = '',
}) => {
  return (
    <span
      role='status'
      aria-label='Loading'
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox='0 0 80 80'
        className='animate-spin'
        width='100%'
        height='100%'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M40.0003 6.66675V20.0001M54.0003 26.0001L63.667 16.3334M60.0003 40.0001H73.3337M54.0003 54.0001L63.667 63.6667M40.0003 60.0001V73.3334M16.3337 63.6667L26.0003 54.0001M6.66699 40.0001H20.0003M16.3337 16.3334L26.0003 26.0001'
          stroke='currentColor'
          className={trackClassName}
          strokeWidth={4}
          strokeLinecap='round'
          strokeLinejoin='round'
        />

        <path
          d='M54 25.9999L63.6667 16.3333'
          stroke='currentColor'
          className={accentClassName}
          strokeWidth={4}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>

      <span className='sr-only'>Loading…</span>
    </span>
  );
};
