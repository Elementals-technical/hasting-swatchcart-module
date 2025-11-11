import { AttributeHelper } from '../../../features/swatches/lib/AttributeHelper';
import { ImageGridZoom } from '../../../features/swatches/ui/ImageGridZoom/ImageGridZoom';
import { HexGridZoom } from '../../../features/swatches/ui/HexGridZoom/HexGridZoom';
import type { AttributeValue } from '../../../features/swatches/model/types';
import { useAppSelector } from '../../../app/store/store';
import { getSelectedMaterials } from '../../../features/swatches/model/selectors';
import { CheckMarkIconSVG } from '../../../app/assets/svg/CheckMarkIconSVG';
import { getMultiCartItems } from '../../../features/MultiProduct/model/selectors';
import { useMemo } from 'react';

interface IMaterialListItemProps {
  val: AttributeValue;
  onClick: (item: AttributeValue) => void;
}

export const MaterialListItem = ({ val, onClick }: IMaterialListItemProps) => {
  const selected = useAppSelector(getSelectedMaterials);
  const selectedProducts = useAppSelector(getMultiCartItems);

  const allItems = useMemo(() => {
    return selectedProducts.flatMap((p) => p.items);
  }, [selectedProducts]);

  const source = allItems.length ? allItems : selected;

  const handleSelect = (item: AttributeValue) => {
    onClick(item);
  };

  const value = val && val.metadata?.value;
  const isSelected = source.find(
    (elem) =>
      elem.metadata?.value === value && elem.parentName === val.parentName,
  );

  return (
    <div className='w-31 rounded mb-[20px] sm:w-40'>
      <button
        key={val.assetId}
        onClick={() => handleSelect(val)}
        className={`w-37 h-37 rounded sm:w-40 sm:h-40 relative aspect-square overflow-hidden transition ${
          isSelected ? 'border-amber-700' : 'border-transparent'
        }`}
      >
        {AttributeHelper.getImage(val) ? (
          <ImageGridZoom item={val} />
        ) : (
          <HexGridZoom item={val} />
        )}
        <div
          className={`absolute top-0 right-0 m-2 w-[30px] h-[30px] flex justify-center items-center
            bg-[var(--background-grey)] rounded-2xl
            border-none pointer-events-none
            ${isSelected ? 'bg-[var(--main-accent-color)]' : ''}`}
        >
          <CheckMarkIconSVG />
        </div>
      </button>
      <div className='flex flex-col mt-3'>
        <span className='font-xs font-semibold leading-[14px] mb-1'>
          {val.metadata?.label || val.label}{' '}
        </span>
        <span className='text-[10px] font-medium leading-[12px]'>
          {val.parentName}{' '}
        </span>
      </div>
    </div>
  );
};
