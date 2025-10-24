import { MaterialItem } from '../../../../shared/ui/MaterialItem/MaterialItem';
import type { ICartItem } from '../../model/types';
import { Counter } from '../Counter/Counter';

interface ICartListItemProps {
  item: ICartItem;
  canInc: boolean;
  onDelete: (item: ICartItem) => void;
  onIncrement: (item: ICartItem) => void;
  onDecrement: (item: ICartItem) => void;
}

export const CartListItem = ({
  item,
  canInc,
  onDelete,
  onIncrement,
  onDecrement,
}: ICartListItemProps) => {
  // const dispatch = useAppDispatch();
  // const canInc = useAppSelector(getCartCanIncrement);

  // const handleDelete = () => {
  //   // DeleteSelected material from the Cart
  //   dispatch(removeItem({ selectedMaterial: item }));
  //   // DeleteSelected material from the  SwatchesList
  //   dispatch(setSelectedMaterials({ selectedMaterial: item }));
  // };

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
            // onIncrement={() => dispatch(increment({ selectedMaterial: item }))}
            // onDecrement={() => dispatch(decrement({ selectedMaterial: item }))}
            onIncrement={() => onIncrement(item)}
            onDecrement={() => onDecrement(item)}
            onDelete={() => onDelete(item)}
          />
        </div>
        <div className='absolute top-0 right-0'>$13.00</div>
      </div>
    </li>
  );
};
