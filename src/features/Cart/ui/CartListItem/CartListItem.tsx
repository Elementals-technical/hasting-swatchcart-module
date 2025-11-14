import { MATERIAL_PRICE } from '../../../../shared/constants/constants';
import { MaterialItem } from '../../../../shared/ui/MaterialItem/MaterialItem';
import type { ICartItem } from '../../model/types';
import { Counter } from '../Counter/Counter';

interface ICartListItemProps {
  item: ICartItem;
  canInc: boolean;
  onDelete: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const CartListItem = ({
  item,
  canInc,
  onDelete,
  onIncrement,
  onDecrement,
}: ICartListItemProps) => {
  return (
    <li
      key={item.assetId}
      className='
        border-b border-[var(--border)]
        px-[var(--sm-padding)] p-[var(--sm-padding)]
        last:border-b-0'
    >
      <div className='relative flex gap-4 '>
        <div>
          <MaterialItem val={item} />
        </div>
        <div className='flex flex-col justify-between'>
          <div className='flex flex-col'>
            <span className='mb-1 font-semibold text-xs'>
              {item.metadata?.label}
            </span>
            <span className='mb-1 font-bold text-[10px]'>
              {item.parentName}
            </span>
          </div>
          <Counter
            value={item.count}
            canIncrement={canInc}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onDelete={onDelete}
          />
        </div>
        <div className=' absolute text-xs top-0 right-0 font-bold'>
          ${item.count * MATERIAL_PRICE}
        </div>
      </div>
    </li>
  );
};
