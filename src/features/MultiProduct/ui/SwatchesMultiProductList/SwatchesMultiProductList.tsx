import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import { AttributeValue } from '../../../swatches/model/types';
import {
  IMultiCartProductItem,
  ISwatchSelectedMaterial,
} from '../../model/types';
import { setMultiCartItems } from '../../model/multiProductCartSlice';
import { getMultiCartItems } from '../../model/selectors';
import SwatchListItem from '../SwatchListItem/SwatchListItem';
import { useCartCount } from '../../../swatches/utils/hooks/useCartCount';

/**
 * Simple placeholder tile used to visually represent free swatch slots.
 *
 * Renders an empty bordered square tile to fill up to `MAX_SLOTS`
 * when there are fewer selected swatches.
 */
const MockTile: React.FC = () => (
  <div
    className={[
      'relative w-[40px] h-[40px] rounded-md aspect-square overflow-hidden',
      'border border-solid border-[var(--border)] bg-[var(--sidebar-b)] sm:w-[64px] sm:h-[64px]',
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
    if (!selectedProducts.length) return;

    const targetAssetId = item.productInformation?.assetId;

    /**
     * Identifies the same swatch inside product.items
     */
    const isSameSwatch = (i: AttributeValue) =>
      i.parentName === item.parentName &&
      i.metadata?.label === item.metadata?.label;

    const nextSelectedProducts = selectedProducts
      .map((product) => {
        // Only update the product that owns this swatch
        if (product.assetId !== targetAssetId) return product;

        const nextItems = product.items.filter((i) => !isSameSwatch(i));

        return { ...product, items: nextItems };
      })
      // Remove products that have no items left
      .filter((product) => product.items.length > 0) as IMultiCartProductItem[];

    dispatch(setMultiCartItems(nextSelectedProducts));
  };

  // Number of placeholder tiles to render so the total count always matches MAX_SLOTS
  const mockCount = Math.max(0, MAX_SLOTS - selectedMaterials.length);
  const cartCount = useCartCount(selectedMaterials);

  return (
    <div className={containerStyles}>
      <div className='flex flex-row justify-between items-center mb-[12px]'>
        <div className='relative'>
          <div className='text-[12px]'>Swatches list</div>
          <span className='absolute top-0 right-[-20px] font-medium text-[var(--main-accent-color)] text-[8px] leading-none'>
            Free
          </span>
        </div>
        <div className='text-[12px]'>
          {cartCount}/{MAX_SLOTS} Selected
        </div>
      </div>

      <div className='flex flex-row flex-wrap gap-[8px]'>
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
