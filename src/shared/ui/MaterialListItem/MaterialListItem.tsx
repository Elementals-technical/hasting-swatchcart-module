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
    <div className='flex flex-col gap-[8px]'>
      <button
        key={val.assetId}
        onClick={() => handleSelect(val)}
        className={`
        relative w-full aspect-square overflow-hidden rounded
        border transition
        ${isSelected ? 'border-amber-700' : 'border-transparent'}
      `}
      >
        <div className='absolute inset-0'>
          {AttributeHelper.getImage(val) ? (
            <ImageGridZoom item={val} />
          ) : (
            <HexGridZoom item={val} />
          )}
        </div>

        <div
          className={`
          absolute top-0 right-0 m-2 h-[30px] w-[30px]
          flex items-center justify-center rounded-2xl border-none
          bg-[var(--background-grey)] pointer-events-none
          ${isSelected ? 'bg-[var(--main-accent-color)]' : ''}
        `}
        >
          <CheckMarkIconSVG />
        </div>
      </button>

      <div className='mb-[12px] flex flex-col'>
        <span className='mb-[4px] text-[14px] font-semibold leading-[16px]'>
          {val.metadata?.label || val.label}{' '}
        </span>
        <span className='text-[12px] font-medium leading-[14px]'>
          {val.parentName}{' '}
        </span>
      </div>
    </div>
  );
};
