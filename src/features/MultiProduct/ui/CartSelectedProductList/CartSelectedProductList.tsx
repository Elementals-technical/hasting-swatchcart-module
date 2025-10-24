import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { getActiveMultiCartProduct, getCartItems } from '../../model/selectors';
import type { IProductCart } from '../../model/types';
import { setActiveMultiCartProduct } from '../../model/multiProductCartSlice';
import { Slider } from '../../../../shared/ui/Slider/Slider';

export const CartSelectedProductList = () => {
  const dispatch = useAppDispatch();
  const selectedProduct = useAppSelector(getActiveMultiCartProduct);
  const selectedProducts = useAppSelector(getCartItems);
  const handleClick = (item: IProductCart) => {
    dispatch(setActiveMultiCartProduct(item));
  };

  return (
    <div className='flex items-center gap-4 p-[var(--sm-padding)] border-b border-solid border-[var(--border)]'>
      <Slider
        items={selectedProducts}
        activeId={selectedProduct?.productId}
        onSelect={handleClick}
      />
    </div>
  );
};
