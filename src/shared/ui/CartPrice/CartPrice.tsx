import { useMemo } from 'react';
import { ICartItem } from '../../../features/Cart/model/types';
import { MATERIAL_PRICE } from '../../constants/constants';

interface ICartPriceProps {
  materials: ICartItem[];
  containerStyles?: string;
}

export const CartPrice = ({
  materials,
  containerStyles = 'flex flex-col gap-2 text-xs/snug p-[var(--padding)] border-t border-solid border-[var(--border)]  sm:gap-3 sm:p-[var(--sm-padding)]',
}: ICartPriceProps) => {
  const COMMON_STYLES = 'flex justify-between items-center';

  const totalPrice = useMemo(() => {
    return (
      materials.reduce((sum, item) => sum + (item.count ?? 0), 0) *
      MATERIAL_PRICE
    );
  }, [materials]);

  return (
    <div className={containerStyles}>
      <div className={COMMON_STYLES}>
        <span>Subtotal</span>
        <span>${totalPrice}</span>
      </div>
      <div className={`${COMMON_STYLES} text-[var(--main-accent-color)]`}>
        <span>Savings</span>
        <span>-${totalPrice}</span>
      </div>
      <div className={`${COMMON_STYLES} text-sm font-medium`}>
        <span>Total</span>
        <span>$0</span>
      </div>
    </div>
  );
};
