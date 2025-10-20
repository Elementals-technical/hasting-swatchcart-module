import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { getSelectedMaterials } from '../../model/selectors';
import type { AttributeValue } from '../../model/types';
import { setSelectedMaterials } from '../../model/swatchesSlice';
import { AttributeHelper } from '../../lib/AttributeHelper';
import { ImageGridZoom } from '../ImageGridZoom/ImageGridZoom';
import { HexGridZoom } from '../HexGridZoom/HexGridZoom';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';

const MockTile: React.FC = () => (
  <div
    className={[
      'relative w-16 h-16 rounded-sm aspect-square overflow-hidden',
      'border border-solid border-[var(--border)] bg-[var(--sidebar-b)]',
    ].join(' ')}
    aria-hidden
  />
);

export const SwatchesList = () => {
  const dispatch = useAppDispatch();
  const selectedMaterials = useAppSelector(getSelectedMaterials) ?? [];

  const handleSelect = (item: AttributeValue) => {
    dispatch(setSelectedMaterials({ selectedMaterial: item }));
  };

  const mockCount = Math.max(0, MAX_SLOTS - selectedMaterials.length);

  return (
    <div className='p-[var(--padding)] border-t border-solid border-[var(--border)] shrink-0 sm:p-[var(--sm-padding)]'>
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
        {selectedMaterials.map((val, index) => (
          <button
            key={`${val.metadata.label || index}/${val.parentName}`}
            onClick={() => handleSelect(val)}
            className='relative w-16 h-16 bg-[var(--sidebar-b)] border border-solid border-[var(--border)] rounded-sm aspect-square overflow-hidden transition'
            aria-label={`Selected swatch ${val.name ?? val.assetId}`}
            title='Click to remove'
          >
            {AttributeHelper.getImage(val) ? (
              <ImageGridZoom item={val} />
            ) : (
              <HexGridZoom item={val} />
            )}

            <div
              className='absolute top-0 right-0 m-2 w-[16px] h-[16px] flex justify-center items-center
                         bg-[var(--background-grey)] rounded-2xl border-none pointer-events-none'
            >
              <CloseIconSVG className='w-2 h-2 stroke-[var(--svg-dark)]' />
            </div>
          </button>
        ))}

        {Array.from({ length: mockCount }).map((_, i) => (
          <MockTile key={`mock-${i}`} />
        ))}
      </div>
    </div>
  );
};
