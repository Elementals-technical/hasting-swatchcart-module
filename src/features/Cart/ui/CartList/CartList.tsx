import { useAppSelector } from '../../../../app/store/store';
import { getCartItems } from '../../model/selectors';
import { CartListItem } from '../CartListItem/CartListItem';

export const CartList = () => {
  const selectedMaterials = useAppSelector(getCartItems) ?? [];

  return (
    <ul className='flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto py-[var(--padding)]  sm:py-[var(--sm-padding)] sm:gap-5'>
      {selectedMaterials?.map((item) => {
        return (
          <CartListItem
            key={`${item.assetId}/${item.parentName}`}
            item={item}
          />
        );
      })}
    </ul>
  );
};
