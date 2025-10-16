import { AttributeHelper } from '../../../features/swatches/lib/AttributeHelper';
import { ImageGridZoom } from '../../../features/swatches/ui/ImageGridZoom/ImageGridZoom';
import { CloseIconSVG } from '../../../app/assets/svg/CloseIconSVG';
import { HexGridZoom } from '../../../features/swatches/ui/HexGridZoom/HexGridZoom';
import type { AttributeValue } from '../../../features/swatches/model/types';

export interface IMaterialItemProps {
  val: AttributeValue;
  className: string;
  isShowDeleteIcon: boolean;
  handleSelect: (arg: AttributeValue) => void;
}

const DEFAULT_STYLES =
  'w-16 h-16 bg-[var(--sidebar-b)] border border-solid border-[var(--border)] rounded-sm aspect-square overflow-hidden transition';

export const MaterialItem = ({
  val,
  className,
  isShowDeleteIcon = false,
  handleSelect,
}: IMaterialItemProps) => {
  return (
    <button
      key={val.assetId}
      onClick={() => handleSelect(val)}
      className={`relative ${className ? className : DEFAULT_STYLES}`}
      aria-label={`Selected swatch ${val.name ?? val.assetId}`}
      title='Click to remove'
    >
      {AttributeHelper.getImage(val) ? (
        <ImageGridZoom item={val} />
      ) : (
        <HexGridZoom item={val} />
      )}

      {isShowDeleteIcon ? (
        <div
          className='absolute top-0 right-0 m-2 w-[16px] h-[16px] flex justify-center items-center
          bg-[var(--background-grey)] rounded-2xl border-none pointer-events-none'
        >
          <CloseIconSVG className='w-2 h-2 stroke-[var(--svg-dark)]' />
        </div>
      ) : null}
    </button>
  );
};
