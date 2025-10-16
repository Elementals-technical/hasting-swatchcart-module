export const CartPrice = () => {
  const COMMON_STYLES = 'flex justify-between items-center';

  return (
    <div
      className='flex flex-col gap-2 text-xs/snug p-[var(--padding)] border-t border-solid border-[var(--border)]
    sm:gap-3 sm:p-[var(--sm-padding)]
    '
    >
      <div className={COMMON_STYLES}>
        <span>Subtotal</span>
        <span>$32.50</span>
      </div>
      <div className={`${COMMON_STYLES} text-[var(--main-accent-color)]`}>
        <span>Savings</span>
        <span>-$32.50</span>
      </div>
      <div className={`${COMMON_STYLES} text-sm font-medium`}>
        <span>Total</span>
        <span>$32.50</span>
      </div>
    </div>
  );
};
