import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';
import { setIsOpenMultiProductCart } from '../../../swatches/model/swatchesSlice';
import { getMultiCartItems } from '../../model/selectors';
import { SwatchesMultiProductList } from '../SwatchesMultiProductList/SwatchesMultiProductList';
import { getSelectedProduct } from '../../../swatches/model/selectors';

export const SwatchContentContainer = () => {
  const dispatch = useAppDispatch();
  const selectedProduct = useAppSelector(getSelectedProduct);
  const selectedProducts = useAppSelector(getMultiCartItems);

  const handleOpenMultiCart = () => {
    if (selectedProduct) {
      dispatch(setIsOpenMultiProductCart(true));
    }
  };

  const allItems = useMemo(() => {
    return selectedProducts.flatMap((p) => p.items);
  }, [selectedProducts]);

  return (
    <div
      className='flex flex-col border-t border-[var(--border)]
      sm:flex-row
    '
    >
      <SwatchesMultiProductList
        selectedMaterials={allItems}
        containerStyles='flex flex-col p-[var(--sm-padding)] shrink-0 sm:w-[50%] sm:border-r sm:border-[var(--border)]'
      />
      <div className='flex p-[var(--sm-padding)] border-t border-[var(--border)] sm:border-none sm:w-[50%] sm:justify-center sm:items-center lg:justify-end lg:items-end'>
        <div className='lg:w-[340px]'>
          <CustomButton onClick={handleOpenMultiCart}>
            ADD SWATCHES TO CART
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
