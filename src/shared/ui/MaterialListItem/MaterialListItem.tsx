import { AttributeHelper } from '../../../features/swatches/lib/AttributeHelper';
import { ImageGridZoom } from '../../../features/swatches/ui/ImageGridZoom/ImageGridZoom';
import { HexGridZoom } from '../../../features/swatches/ui/HexGridZoom/HexGridZoom';
import type { AttributeValue } from '../../../features/swatches/model/types';
import { CheckMarkIconSVG } from '../../../app/assets/svg/CheckMarkIconSVG';

interface IMaterialListItemProps {
  val: AttributeValue;
  isSelected: boolean;
  onClick: (item: AttributeValue) => void;
}

export const MaterialListItem = ({
  val,
  isSelected,
  onClick,
}: IMaterialListItemProps) => {
  const handleSelect = (item: AttributeValue) => {
    onClick(item);
  };

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
          flex flex-row items-center justify-center rounded-2xl border-none
          bg-[var(--background-grey)] pointer-events-none
          ${isSelected ? 'bg-[var(--main-accent-color)]' : ''}
        `}
        >
          <CheckMarkIconSVG />
        </div>
      </button>

      <div className='mb-[12px] flex flex-col'>
        <span className='mb-[4px] text-[14px] font-semibold leading-[16px]'>
          {val.label || val.metadata?.label}{' '}
        </span>
        <span className='text-[12px] font-medium leading-[14px]'>
          {val.parentName}{' '}
        </span>
      </div>
    </div>
  );
};
