import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { setSelectedMaterial } from '../../../swatches/model/swatchesSlice';
import { CartPrice } from '../../../Cart/ui/CartPrice/CartPrice';
import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import { getMultiCartItems } from '../../model/selectors';
import { useMemo } from 'react';
import type { IMultiProductCartHandleProps } from '../../model/types';
import {
  decrementMultiProductItem,
  incrementMultiProductItem,
  removeMultiProductItem,
} from '../../model/multiProductCartSlice';
import { CartListItem } from '../../../Cart/ui/CartListItem/CartListItem';
import { MultiProductCartHeader } from '../MultiProductCartHeader/MultiProductCartHeader';

interface IMultiProductItemCartProps {
  onSendData?: (data: unknown) => void;
  // onToggleSidebar: () => void;
}

export const MultiProductItemCart = ({
  onSendData,
  // onToggleSidebar,
}: IMultiProductItemCartProps) => {
  const dispatch = useAppDispatch();
  const selectedProducts = useAppSelector(getMultiCartItems);

  const allItems = useMemo(() => {
    return selectedProducts.flatMap((p) => p.items);
  }, [selectedProducts]);

  const handleDelete = ({ item, productId }: IMultiProductCartHandleProps) => {
    const { parentName, metadata } = item;
    const label = metadata.label;
    if (productId && label && parentName) {
      dispatch(removeMultiProductItem({ productId, label, parentName }));
      // DeleteSelected material from the  SwatchesList
      dispatch(setSelectedMaterial({ selectedMaterial: item }));
    }
  };

  const handleIncrement = ({
    item,
    productId,
  }: IMultiProductCartHandleProps) => {
    const { parentName, metadata } = item;
    const label = metadata.label;

    if (productId && label && parentName) {
      dispatch(incrementMultiProductItem({ productId, label, parentName }));
    }
  };

  const handleDecrement = ({
    item,
    productId,
  }: IMultiProductCartHandleProps) => {
    const { parentName, metadata } = item;
    const label = metadata.label;

    if (productId && label && parentName) {
      dispatch(decrementMultiProductItem({ productId, label, parentName }));
    }
  };

  const totalCount = useMemo(() => {
    return allItems.reduce((sum, item) => sum + (item.count ?? 0), 0);
  }, [allItems]);

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <MultiProductCartHeader totalCount={totalCount} />
      <div className='flex flex-col h-full min-h-0'>
        <ul className='flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto py-[var(--sm-padding)] sm:gap-5'>
          {selectedProducts.map((product) => {
            const { items, name, productId } = product;

            if (!items.length) return null;

            return (
              <>
                <div
                  key={product.productId}
                  className='    border-b border-[var(--border)] p-[var(--padding)] pt-0
        sm:px-[var(--sm-padding)] sm:p-[var(--sm-padding)] sm:pt-0'
                >
                  {name}
                </div>
                <ul>
                  {items?.map((item) => {
                    return (
                      <CartListItem
                        key={`${item.assetId}/${item.parentName}`}
                        item={item}
                        canInc={totalCount < MAX_SLOTS}
                        onDelete={() => handleDelete({ item, productId })}
                        onIncrement={() => handleIncrement({ item, productId })}
                        onDecrement={() => handleDecrement({ item, productId })}
                      />
                    );
                  })}
                </ul>
              </>
            );
          })}
        </ul>
        <div
          className='flex flex-col 
          sm:flex-row sm:w-full sm:justify-between sm:items-center
          sm:border-t sm:border-solid sm:border-[var(--border)]
        '
        >
          <div className='sm:w-[50%] sm:border-r sm:border-solid sm:border-[var(--border)]'>
            <CartPrice containerStyles='flex flex-col gap-2 text-xs/snug p-[var(--padding)] border-t border-solid border-[var(--border)]  sm:gap-3 sm:p-[var(--sm-padding)] sm:border-none' />
          </div>
          <div className='p-[var(--padding)] border-t border-solid border-[var(--border)] shrink-0 sm:w-[50%] sm:border-none'>
            <CustomButton
              onClick={() => onSendData && onSendData(selectedProducts)}
              disabled={allItems.length > MAX_SLOTS + 1}
            >
              GO TO SHIPPING
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};
