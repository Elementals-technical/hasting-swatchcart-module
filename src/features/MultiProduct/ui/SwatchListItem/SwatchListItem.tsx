import React, { useState } from 'react';
import { Hint } from '../../../../shared/ui/Hint/Hint';
import { HexGridZoom } from '../../../swatches/ui/HexGridZoom/HexGridZoom';
import { ImageGridZoom } from '../../../swatches/ui/ImageGridZoom/ImageGridZoom';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { AttributeHelper } from '../../../swatches/lib/AttributeHelper';
import { ISwatchSelectedMaterial } from '../../model/types';

interface ISwatchesListItemProps {
  val: ISwatchSelectedMaterial;
  onDelete: (arg: ISwatchSelectedMaterial) => void;
}

/**
 * Renders a selected swatch item inside the list of chosen materials.
 *
 * The component shows the material preview (image or HEX grid), displays a
 * delete button, and on hover opens a `Hint` tooltip with detailed material
 * information (material name, parent category, product name).
 *
 * Hover logic:
 * - When the user hovers over the swatch, it captures the hovered element,
 *   prepares the tooltip text, and opens the `Hint` component.
 * - The tooltip closes when the mouse leaves the item.
 *
 * Delete logic:
 * - Clicking the close icon triggers `onDelete` with the full swatch object.
 * - The click event is stopped from bubbling so that it does not interfere
 *   with parent click handlers.
 *
 * Accessibility:
 * - The swatch container is focusable (`tabIndex={0}`) for keyboard navigation.
 * - Enter/Space keys are prevented to avoid unintended actions.
 * - ARIA label describes the content for screen readers.
 *
 * @component
 *
 * @param {ISwatchSelectedMaterial} val
 *  The selected material object containing metadata, image/hex info,
 *  and product/category names.
 *
 * @param {(arg: ISwatchSelectedMaterial) => void} onDelete
 *  Callback triggered when the user removes the swatch from the list.
 *
 * @returns {JSX.Element}
 */

const SwatchListItem: React.FC<ISwatchesListItemProps> = ({
  val,
  onDelete,
}) => {
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState({
    materialName: '',
    parentName: '',
    productName: '',
  });
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
            productName: val.productName || 'empty_product_name',
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
          bg-[var(--background-grey)] rounded-2xl border-none z-[100] cursor-pointer'
        >
          <CloseIconSVG className='w-2 h-2 stroke-[var(--svg-dark)]' />
        </div>
      </div>

      <Hint open={isOpen} target={hoveredEl} offset={8}>
        <>
          {text.materialName} | {text.parentName}
        </>
      </Hint>
    </>
  );
};

export default SwatchListItem;
