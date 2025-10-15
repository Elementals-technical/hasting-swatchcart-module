import { AttributeHelper } from '../../lib/AttributeHelper';
import { ImageGridZoom } from '../ImageGridZoom/ImageGridZoom';
import { HexGridZoom } from '../HexGridZoom/HexGridZoom';
import type { AttributeValue } from '../../model/types';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { setSelectedMaterials } from '../../model/swatchesSlice';
import { getSelectedMaterials } from '../../model/selectors';

export const MaterialListItem = ({ val }: { val: AttributeValue }) => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(getSelectedMaterials);

  const handleSelect = (item: AttributeValue) => {
    dispatch(setSelectedMaterials({ selectedMaterial: item }));
  };

  const assetId = val && val.assetId ? val.assetId : 'false';
  const isSelected = selected.find((elem) => elem.assetId === assetId);

  return (
    <button
      key={val.assetId}
      onClick={() => handleSelect(val)}
      className={`relative aspect-square border-2 rounded-sm overflow-hidden transition ${
        isSelected ? 'border-amber-700' : 'border-transparent'
      }`}
    >
      {AttributeHelper.getImage(val) ? (
        <ImageGridZoom item={val} />
      ) : (
        <HexGridZoom item={val} />
      )}
      {isSelected && (
        <div className='absolute w-[30px] h-[30px] m-2 r-2 bg-red-500 rounded-2xl inset-0 ring-2 ring-red pointer-events-none'>
          ckecked
        </div>
      )}
    </button>
  );
};
