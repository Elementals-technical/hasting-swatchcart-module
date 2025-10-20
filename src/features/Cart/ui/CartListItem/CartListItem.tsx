import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { MaterialItem } from '../../../../shared/ui/MaterialItem/MaterialItem';
import { setSelectedMaterials } from '../../../swatches/model/swatchesSlice';
import { decrement, increment, removeItem } from '../../model/cartSlice';
import { getCartCanIncrement, getCartItems } from '../../model/selectors';
import type { ICartItem } from '../../model/types';
import { Counter } from '../Counter/Counter';

interface ICartListItemProps {
  item: ICartItem;
}

export const CartListItem = ({ item }: ICartListItemProps) => {
  const dispatch = useAppDispatch();
  const canInc = useAppSelector(getCartCanIncrement);
  const selectedMaterials = useAppSelector(getCartItems) ?? [];

  const handleDelete = () => {
    // DeleteSelected material from the Cart
    dispatch(removeItem({ selectedMaterial: item }));
    // DeleteSelected material from the  SwatchesList
    dispatch(setSelectedMaterials({ selectedMaterial: item }));
  };

  console.log('CartListItem selectedMaterials', selectedMaterials);
  return (
    <li
      key={item.assetId}
      className='
        border-b border-[var(--border)] p-[var(--padding)]
        sm:px-[var(--sm-padding)] sm:pb-[var(--sm-padding)]'
    >
      <div className='relative flex gap-4 '>
        <div>
          <MaterialItem val={item} />
        </div>
        <div className='flex flex-col justify-between'>
          <div className='flex flex-col'>
            <span className='mb-1 font-medium'>{item.metadata.label}</span>
            <span className='mb-1 font-semibold'>{item.parentName}</span>
          </div>
          <Counter
            value={item.count}
            canIncrement={canInc}
            onIncrement={() => dispatch(increment({ selectedMaterial: item }))}
            onDecrement={() => dispatch(decrement({ selectedMaterial: item }))}
            onDelete={handleDelete}
          />
        </div>
        <div className='absolute top-0 right-0'>$13.00</div>
      </div>
    </li>
  );
};
