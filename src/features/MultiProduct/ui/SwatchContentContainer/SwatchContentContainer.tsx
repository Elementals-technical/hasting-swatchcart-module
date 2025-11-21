import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';
import { setIsOpenMultiProductCart } from '../../../swatches/model/swatchesSlice';
import { getMultiCartItems } from '../../model/selectors';
import { SwatchesMultiProductList } from '../SwatchesMultiProductList/SwatchesMultiProductList';
import { AttributeValue } from '../../../swatches/model/types';

export const SwatchContentContainer = () => {
  const dispatch = useAppDispatch();
  const selectedProducts = useAppSelector(getMultiCartItems);

  /**
   * Memoized list of all selected materials across all selected products.
   *
   * Iterates through the array of `selectedProducts` and extracts each product's
   * `items` array, flattening them into a single list.
   *
   * This recomputes only when `selectedProducts` changes.
   *
   * @constant
   * @type {AttributeValue[]}
   */
  const allItems: AttributeValue[] = useMemo(() => {
    return selectedProducts.flatMap((p) => p.items);
  }, [selectedProducts]);

  /**
   * Opens the Multi-Product Cart modal if there is at least one selected product.
   *
   * Checks whether `selectedProducts` contains items.
   * If so, dispatches an action to set the Multi-Product Cart state to open.
   *
   * @function handleOpenMultiCart
   * @returns {void}
   */

  const handleOpenMultiCart = (): void => {
    if (allItems.length) {
      dispatch(setIsOpenMultiProductCart(true));
    }
  };

  return (
    <div
      className='flex flex-col border-t border-[var(--border)] shrink-0 shadow-[0_-2px_10px_rgba(40,40,40,0.10)]
      sm:flex-row
    '
    >
      <SwatchesMultiProductList
        selectedMaterials={allItems}
        containerStyles='flex flex-col p-[var(--sm-padding)] shrink-0 sm:w-[50%] sm:border-r sm:border-[var(--border)]'
      />
      <div className='flex w-full p-[var(--sm-padding)] border-t border-[var(--border)] sm:border-none lg:w-[50%] sm:justify-center sm:items-center lg:justify-end lg:items-end'>
        <div className='w-full lg:w-[50%]'>
          <CustomButton onClick={handleOpenMultiCart}>
            ADD SWATCHES TO CART
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
