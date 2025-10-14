// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function InfoIcon(props: any) {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
      className='size-5'
      {...props}
    >
      <rect
        x='0.666667'
        y='0.666667'
        width='10.6667'
        height='10.6667'
        rx='5.33333'
        stroke='#B1B1B1'
        strokeWidth='1.33333'
      />
      <circle cx='6.00065' cy='3.33268' r='0.666667' fill='#B1B1B1' />
      <rect x='5.33398' y='5.33398' width='1.33333' height='4' fill='#B1B1B1' />
    </svg>
  );
}
