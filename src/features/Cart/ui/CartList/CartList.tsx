import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import { SwatchLimitModal } from '../../../../shared/ui/SwatchLimitModal/SwatchLimitModal';
import { getSelectedMaterials } from '../../../swatches/model/selectors';
import {
  decrement,
  increment,
  removeItem,
  setSelectedMaterial,
} from '../../../swatches/model/swatchesSlice';
import { useCartCount } from '../../../swatches/utils/hooks/useCartCount';
import type { ICartItem } from '../../model/types';
import { CartListItem } from '../CartListItem/CartListItem';

export const CartList = () => {
  const dispatch = useAppDispatch();
  const selectedMaterials = useAppSelector(getSelectedMaterials) ?? [];
  const totalCount = useCartCount(selectedMaterials);

  const [isShowLimitMessage, setIsShowLimitMessage] = useState(false);

  const handleDelete = (item: ICartItem) => {
    // DeleteSelected material from the Cart
    dispatch(removeItem({ selectedMaterial: item }));
    // DeleteSelected material from the  SwatchesList
    dispatch(
      setSelectedMaterial({
        selectedMaterial: item,
        materialCount: 1,
        selectedMaterials,
      }),
    );
  };

  const handleIncrement = (item: ICartItem) => {
    if (item.count + 1 === 3) {
      setIsShowLimitMessage(true);
    } else {
      dispatch(increment({ selectedMaterial: item }));
    }
  };

  const handleDecrement = (item: ICartItem) => {
    dispatch(decrement({ selectedMaterial: item }));
  };

  return (
    <>
      <ul className='flex flex-col flex-1 min-h-0 overflow-y-auto'>
        {selectedMaterials?.map((item) => {
          return (
            <CartListItem
              key={`${item.label}/${item.parentName}`}
              item={item}
              canInc={totalCount < MAX_SLOTS}
              onDelete={() => handleDelete(item)}
              onIncrement={() => handleIncrement(item)}
              onDecrement={() => handleDecrement(item)}
            />
          );
        })}
      </ul>
      <SwatchLimitModal
        body='A maximum of two swatches per material may be ordered.'
        isOpen={isShowLimitMessage}
        onClose={() => setIsShowLimitMessage(false)}
      />
    </>
  );
};
