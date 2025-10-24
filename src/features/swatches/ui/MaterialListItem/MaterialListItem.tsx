import { AttributeHelper } from '../../lib/AttributeHelper';
import { ImageGridZoom } from '../ImageGridZoom/ImageGridZoom';
import { HexGridZoom } from '../HexGridZoom/HexGridZoom';
import type { AttributeValue } from '../../model/types';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { setSelectedMaterials } from '../../model/swatchesSlice';
import { getSelectedMaterials } from '../../model/selectors';
import { CheckMarkIconSVG } from '../../../../app/assets/svg/CheckMarkIconSVG';

export const MaterialListItem = ({ val }: { val: AttributeValue }) => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(getSelectedMaterials);

  const handleSelect = (item: AttributeValue) => {
    dispatch(setSelectedMaterials({ selectedMaterial: item }));
  };

  const assetId = val && val.assetId ? val.assetId : 'false';
  const isSelected = selected.find(
    (elem) => elem.assetId === assetId && elem.parentName === val.parentName,
  );

  return (
    <div className='w-31 rounded mb-[20px] sm:w-40'>
      <button
        key={val.assetId}
        onClick={() => handleSelect(val)}
        className={`w-31 h-31 rounded sm:w-40 sm:h-40 relative aspect-square overflow-hidden transition ${
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
        <span className='font-normal mb-1'>{val.metadata.label} </span>
        <span className='font-medium'>{val.parentName} </span>
      </div>
    </div>
  );
};
