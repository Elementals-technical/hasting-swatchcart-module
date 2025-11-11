import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import { Hint } from '../../../../shared/ui/Hint/Hint';
import { AttributeValue } from '../../../swatches/model/types';
import { ImageGridZoom } from '../../../swatches/ui/ImageGridZoom/ImageGridZoom';
import { AttributeHelper } from '../../../swatches/lib/AttributeHelper';
import { HexGridZoom } from '../../../swatches/ui/HexGridZoom/HexGridZoom';
import { IMultiCartProductItem } from '../../model/types';
import {
  setActiveMultiCartProduct,
  setMultiCartItems,
} from '../../model/multiProductCartSlice';
import { getMultiCartItems } from '../../model/selectors';
import { getSelectedProduct } from '../../../swatches/model/selectors';

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
  containerStyles?: string;
  selectedMaterials: AttributeValue[];
}

export const SwatchesMultiProductList = ({
  selectedMaterials,
  containerStyles = 'p-[var(--padding)] border-t border-solid border-[var(--border)] shrink-0 sm:p-[var(--sm-padding)]',
}: ISwatchesListProps) => {
  const dispatch = useAppDispatch();
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState<{
    materialName: string;
    parentName: string;
  }>({ materialName: '', parentName: '' });
  const selectedProduct = useAppSelector(getSelectedProduct);
  const selectedProducts = useAppSelector(getMultiCartItems);

  const handleSelect = (item: AttributeValue) => {
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
            <button
              key={`${meta?.label || index}/${val.parentName}`}
              onClick={() => handleSelect(val)}
              className='relative w-10 h-10 bg-[var(--sidebar-b)] border border-solid border-[var(--border)] rounded-sm aspect-square overflow-hidden transition
                sm:w-16 sm:h-16'
              aria-label={`Selected swatch ${val.name ?? val.assetId}`}
              title='Click to remove'
              onMouseEnter={(e) => {
                setHoveredEl(e.currentTarget as HTMLElement);
                setText({
                  materialName:
                    meta?.label || val?.name || 'empty_materialName',
                  parentName: val.parentName,
                });
                setIsOpen(true);
              }}
              onMouseLeave={() => {
                setIsOpen(false);
              }}
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
          );
        })}
        <Hint open={isOpen} target={hoveredEl} offset={8}>
          <>
            {text.materialName}
            <br />({text.parentName})
          </>
        </Hint>
        {Array.from({ length: mockCount }).map((_, i) => (
          <MockTile key={`mock-${i}`} />
        ))}
      </div>
    </div>
  );
};
