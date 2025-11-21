import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import { AttributeValue } from '../../../swatches/model/types';
import {
  IMultiCartProductItem,
  ISwatchSelectedMaterial,
} from '../../model/types';
import {
  setActiveMultiCartProduct,
  setMultiCartItems,
} from '../../model/multiProductCartSlice';
import { getMultiCartItems } from '../../model/selectors';
import { getSelectedProduct } from '../../../swatches/model/selectors';
import SwatchListItem from '../SwatchListItem/SwatchListItem';

/**
 * Simple placeholder tile used to visually represent free swatch slots.
 *
 * Renders an empty bordered square tile to fill up to `MAX_SLOTS`
 * when there are fewer selected swatches.
 */
const MockTile: React.FC = () => (
  <div
    className={[
      'relative w-10 h-10 rounded-sm aspect-square overflow-hidden',
      'border border-solid border-[var(--border)] bg-[var(--sidebar-b)] sm:w-16 sm:h-16',
    ].join(' ')}
    aria-hidden
  />
);

interface ISwatchesListProps {
  /**
   * Optional wrapper classes for the outer container
   * (padding, border, etc. – Tailwind / className string).
   */
  containerStyles?: string;

  /**
   * List of currently selected swatch materials across products.
   * Used to render the visual list and compute remaining free slots.
   */
  selectedMaterials: ISwatchSelectedMaterial[];
}

/**
 * Renders the "Swatches list" section for the multi-product cart.
 *
 * Features:
 * - Displays all selected swatches as tiles using `SwatchListItem`.
 * - Allows removing a swatch across all products via `onDelete`.
 * - Shows the current count and the `MAX_SLOTS` limit (with "Free" label).
 * - Fills remaining slots with placeholder tiles (`MockTile`) for a
 *   consistent grid layout.
 *
 * Removal logic:
 * - When the user deletes a swatch, finds which product currently owns it,
 *   removes that swatch from that product, and updates the multi-cart store.
 */
export const SwatchesMultiProductList = ({
  selectedMaterials,
  containerStyles = 'p-[var(--padding)] border-t border-solid border-[var(--border)] shrink-0 sm:p-[var(--sm-padding)]',
}: ISwatchesListProps) => {
  const dispatch = useAppDispatch();
  const selectedProduct = useAppSelector(getSelectedProduct);
  const selectedProducts = useAppSelector(getMultiCartItems);

  /**
   * Handles deleting a swatch from whichever product currently contains it.
   *
   * Steps:
   * 1. If there is no `selectedProduct`, exit early.
   * 2. Build a matcher (`isSame`) based on `metadata.label` and `parentName`.
   * 3. Find the product that owns this swatch (`productWithItem`).
   * 4. Filter that product's items to remove the matching swatch.
   * 5. Dispatch updated product data to the multi-cart store and
   *    set it as the active multi-cart product.
   *
   * @param item Swatch to remove from the multi-cart.
   */
  const handleSelect = (item: ISwatchSelectedMaterial) => {
    if (!selectedProduct) return;

    const isSame = (i: AttributeValue) =>
      i.metadata?.label === item.metadata?.label &&
      i.parentName === item.parentName;

    const productWithItem = selectedProducts.find((p) => p.items.some(isSame));

    const filteredItems = productWithItem?.items.filter((i) => !isSame(i));

    if (productWithItem) {
      const cartProductItem: IMultiCartProductItem = {
        assetId: productWithItem.assetId || 'empty_assetId',
        name: productWithItem.name,
        items: filteredItems || [],
      };

      dispatch(setMultiCartItems(cartProductItem));
      dispatch(setActiveMultiCartProduct(cartProductItem));
    }
  };

  // Number of placeholder tiles to render so the total count always matches MAX_SLOTS
  const mockCount = Math.max(0, MAX_SLOTS - selectedMaterials.length);

  return (
    <div className={containerStyles}>
      <div className='flex justify-between items-center mb-3'>
        <div className='relative w-30'>
          <div className=''>Swatches list</div>
          <span className='absolute top-0 right-[-6px] font-medium text-[var(--main-accent-color)] text-[8px] leading-none'>
            Free
          </span>
        </div>
        <div>
          {selectedMaterials.length}/{MAX_SLOTS} Selected
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        {selectedMaterials.map((val, index) => {
          const meta = val.metadata;
          return (
            <SwatchListItem
              key={`${meta?.label || index}/${val.parentName}`}
              val={val}
              onDelete={handleSelect}
            />
          );
        })}
        {Array.from({ length: mockCount }).map((_, i) => (
          <MockTile key={`mock-${i}`} />
        ))}
      </div>
    </div>
  );
};
