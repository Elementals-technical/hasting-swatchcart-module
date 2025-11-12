import React, { useState } from 'react';
import { Hint } from '../../../../shared/ui/Hint/Hint';
import { HexGridZoom } from '../../../swatches/ui/HexGridZoom/HexGridZoom';
import { ImageGridZoom } from '../../../swatches/ui/ImageGridZoom/ImageGridZoom';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { AttributeHelper } from '../../../swatches/lib/AttributeHelper';
import { AttributeValue } from '../../../swatches/model/types';

interface ISwatchesListItemProps {
  val: AttributeValue;
  onDelete: (arg: AttributeValue) => void;
}

const SwatchListItem: React.FC<ISwatchesListItemProps> = ({
  val,
  onDelete,
}) => {
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState({ materialName: '', parentName: '' });
  const meta = val.metadata;

  const handleDeleteClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onDelete(val);
  };

  return (
    <>
      <div
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
          }
        }}
        className='
          bg-[var(--background-grey)] relative w-10 h-10 border border-solid border-[var(--border)]
          rounded-sm aspect-square overflow-hidden transition sm:w-16 sm:h-16
          select-none
        '
        aria-label={`Selected swatch ${val.name ?? val.assetId}`}
        title='Click to remove'
        onMouseEnter={(e) => {
          setHoveredEl(e.currentTarget);
          setText({
            materialName: meta?.label || val?.name || 'empty_materialName',
            parentName: val.parentName,
          });
          setIsOpen(true);
        }}
        onMouseLeave={() => setIsOpen(false)}
      >
        {AttributeHelper.getImage(val) ? (
          <ImageGridZoom item={val} />
        ) : (
          <HexGridZoom item={val} />
        )}

        <div
          onClick={handleDeleteClick}
          className='absolute top-0 right-0 m-2 w-[16px] h-[16px] flex justify-center items-center
          bg-[var(--background-grey)] rounded-2xl border-none z-[999] cursor-pointer'
        >
          <CloseIconSVG className='w-2 h-2 stroke-[var(--svg-dark)]' />
        </div>
      </div>

      <Hint open={isOpen} target={hoveredEl} offset={8}>
        <>
          {text.materialName}
          <br />({text.parentName})
        </>
      </Hint>
    </>
  );
};

export default SwatchListItem;
