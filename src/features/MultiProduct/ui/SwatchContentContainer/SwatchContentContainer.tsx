import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';
import { getSelectedProduct } from '../../../swatches/model/selectors';
import { setIsOpenMultiProductCart } from '../../../swatches/model/swatchesSlice';
import { SwatchesList } from '../../../swatches/ui/SwatchesList/SwatchesList';
import { getMultiCartItems } from '../../model/selectors';

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
      <SwatchesList
        selectedMaterials={allItems}
        containerStyles='flex flex-col p-[var(--sm-padding)] shrink-0 sm:w-[50%] sm:border-r sm:border-[var(--border)]'
      />
      <div className='flex p-[var(--sm-padding)] border-t border-[var(--border)] sm:border-none sm:w-[50%] sm:justify-center sm:items-center'>
        <CustomButton
          onClick={handleOpenMultiCart}
          // disabled={!selectedMaterials.length}
        >
          ADD SWATCHES TO CART
        </CustomButton>
      </div>
    </div>
  );
};
