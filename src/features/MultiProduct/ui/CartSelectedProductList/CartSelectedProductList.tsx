import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  getActiveMultiCartProduct,
  getMultiCartItems,
} from '../../model/selectors';
import type { IProductCart, ISliderItem } from '../../model/types';
import { setActiveMultiCartProduct } from '../../model/multiProductCartSlice';
import { Slider } from '../../../../shared/ui/Slider/Slider';

export const CartSelectedProductList = () => {
  const dispatch = useAppDispatch();
  const selectedProduct = useAppSelector(getActiveMultiCartProduct);
  const selectedProducts = useAppSelector(getMultiCartItems);

  const handleClick = (item: IProductCart | ISliderItem) => {
    dispatch(setActiveMultiCartProduct(item));
  };

  return (
    <div className='flex! flex-row! items-center! gap-[16px]! p-[var(--sm-padding)]! border-b! border-solid! border-[var(--border)]!'>
      <Slider
        items={selectedProducts}
        activeId={selectedProduct?.productId}
        onSelect={handleClick}
      />
    </div>
  );
};
