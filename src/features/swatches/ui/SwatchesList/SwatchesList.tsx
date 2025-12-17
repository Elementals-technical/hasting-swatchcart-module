import React from 'react';
import { useAppDispatch } from '../../../../app/store/store';
import type { AttributeValue } from '../../model/types';
import { setSelectedMaterial } from '../../model/swatchesSlice';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import SwatchListItem from '../../../MultiProduct/ui/SwatchListItem/SwatchListItem';
import { useCartCount } from '../../utils/hooks/useCartCount';

/**
 * Renders a placeholder tile for an empty swatch slot.
 *
 * Used to visually fill remaining available slots up to {@link MAX_SLOTS}.
 *
 * @component
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

/**
 * Props for {@link SwatchesList}.
 */
interface ISwatchesListProps {
  /**
   * Optional className string applied to the outer container.
   */
  containerStyles?: string;

  /**
   * Currently selected swatch materials.
   */
  selectedMaterials: AttributeValue[];
}

/**
 * Renders the swatches list with selected materials and remaining empty slots.
 *
 * Displays:
 * - header with selected count
 * - selected swatches as list items
 * - placeholder tiles for unused slots up to {@link MAX_SLOTS}
 *
 * @component
 *
 * @param props - {@link ISwatchesListProps}
 */
export const SwatchesList = ({
  selectedMaterials,
  containerStyles = 'p-[var(--sm-padding)] border-t border-solid border-[var(--border)] shrink-0 shadow-[0_-2px_10px_rgba(40,40,40,0.10)]',
}: ISwatchesListProps) => {
  const dispatch = useAppDispatch();

  /**
   * Selects a material and updates the swatches state.
   *
   * @param item - Material value to set as selected
   */
  const handleSelect = (item: AttributeValue) => {
    dispatch(
      setSelectedMaterial({
        selectedMaterial: item,
        materialCount: 1,
        selectedMaterials,
      }),
    );
  };

  const mockCount = Math.max(0, MAX_SLOTS - selectedMaterials.length);
  const cartCount = useCartCount(selectedMaterials);

  return (
    <div className={containerStyles}>
      <div className='flex flex-row justify-between items-center mb-[12px]'>
        <div className='relative'>
          <div className='text-xs'>Swatches list</div>
          <span className='absolute top-0 right-[-20px] font-medium text-[var(--main-accent-color)] text-[8px] leading-none'>
            Free
          </span>
        </div>
        <div className='text-xs'>
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
