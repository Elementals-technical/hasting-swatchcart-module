import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { getSelectedMaterials } from '../../../swatches/model/selectors';
import {
  decrement,
  increment,
  removeItem,
  setSelectedMaterial,
} from '../../../swatches/model/swatchesSlice';
// import { decrement, increment, removeItem } from '../../model/cartSlice';
import { getCartCanIncrement } from '../../model/selectors';
import type { ICartItem } from '../../model/types';
import { CartListItem } from '../CartListItem/CartListItem';

export const CartList = () => {
  const dispatch = useAppDispatch();
  const selectedMaterials = useAppSelector(getSelectedMaterials) ?? [];
  const canInc = useAppSelector(getCartCanIncrement);

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
    dispatch(increment({ selectedMaterial: item }));
  };

  const handleDecrement = (item: ICartItem) => {
    dispatch(decrement({ selectedMaterial: item }));
  };

  return (
    <ul className='flex flex-col flex-1 min-h-0 overflow-y-auto'>
      {selectedMaterials?.map((item) => {
        return (
          <CartListItem
            key={`${item.assetId}/${item.parentName}`}
            item={item}
            canInc={canInc}
            onDelete={() => handleDelete(item)}
            onIncrement={() => handleIncrement(item)}
            onDecrement={() => handleDecrement(item)}
          />
        );
      })}
    </ul>
  );
};
