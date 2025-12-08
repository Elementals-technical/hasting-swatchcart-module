import React from 'react';
import { useAppDispatch } from '../../../../app/store/store';
import type { AttributeValue } from '../../model/types';
import { setSelectedMaterial } from '../../model/swatchesSlice';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import SwatchListItem from '../../../MultiProduct/ui/SwatchListItem/SwatchListItem';

const MockTile: React.FC = () => (
  <div
    className={[
      'relative w-[40px] h-[40px] rounded-sm aspect-square overflow-hidden',
      'border border-solid border-[var(--border)] bg-[var(--sidebar-b)] sm:w-[64px] sm:h-[64px]',
    ].join(' ')}
    aria-hidden
  />
);

interface ISwatchesListProps {
  containerStyles?: string;
  selectedMaterials: AttributeValue[];
}

export const SwatchesList = ({
  selectedMaterials,
  containerStyles = 'p-[var(--sm-padding)] border-t border-solid border-[var(--border)] shrink-0 shadow-[0_-2px_10px_rgba(40,40,40,0.10)]',
}: ISwatchesListProps) => {
  const dispatch = useAppDispatch();

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

  return (
    <div className={containerStyles}>
      <div className='flex flex-row justify-between items-center mb-[12px]'>
        <div className='relative'>
          <div className=''>Swatches list</div>
          <span className='absolute top-0 right-[-20px] font-medium text-[var(--main-accent-color)] text-[8px] leading-none'>
            Free
          </span>
        </div>
        <div>
          {selectedMaterials.length}/{MAX_SLOTS} Selected
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
