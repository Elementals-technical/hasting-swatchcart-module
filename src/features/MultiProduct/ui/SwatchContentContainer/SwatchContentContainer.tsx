import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';
import { setIsOpenMultiProductCart } from '../../../swatches/model/swatchesSlice';
import { getMultiCartItems } from '../../model/selectors';
import { SwatchesMultiProductList } from '../SwatchesMultiProductList/SwatchesMultiProductList';
import { ISwatchSelectedMaterial } from '../../model/types';

/**
 * Container component responsible for:
 * - Displaying a combined list of swatches from all selected products
 * - Showing a preview section and an action button
 * - Handling the opening of the Multi-Product Cart modal
 *
 * It collects materials from all products, normalizes them with additional
 * context (product name), and renders them in a structured two-column layout.
 *
 * Also includes the "Add Swatches to Cart" button which opens the cart modal
 * only when there are selected items.
 *
 * @component
 */
export const SwatchContentContainer = () => {
  const dispatch = useAppDispatch();
  const selectedProducts = useAppSelector(getMultiCartItems);

  /**
   * Memoized list of all selected materials across all selected products.
   *
   * For each product, its `items` are extracted and extended with the
   * `productName` property so the UI knows which product each swatch belongs to.
   *
   * This recomputes only when `selectedProducts` changes.
   *
   * @constant
   * @type {ISwatchSelectedMaterial[]}
   */
  const allItems: ISwatchSelectedMaterial[] = useMemo(() => {
    return selectedProducts.flatMap((p) =>
      p.items.map((item) => ({
        ...item,
        productName: p.name,
      })),
    );
  }, [selectedProducts]);

  /**
   * Opens the Multi-Product Cart modal if there are selected swatches.
   *
   * Checks whether `allItems` contains items.
   * If so, dispatches an action that opens the modal UI.
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
