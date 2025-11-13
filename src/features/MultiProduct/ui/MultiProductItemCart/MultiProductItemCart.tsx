import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { setSelectedMaterial } from '../../../swatches/model/swatchesSlice';
import { CartPrice } from '../../../../shared/ui/CartPrice/CartPrice';
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

  const handleDelete = ({ item, assetId }: IMultiProductCartHandleProps) => {
    const { parentName, metadata } = item;
    const label = metadata?.label;
    if (assetId && label && parentName) {
      dispatch(removeMultiProductItem({ assetId, label, parentName }));
      // DeleteSelected material from the  SwatchesList
      dispatch(setSelectedMaterial({ selectedMaterial: item }));
    }
  };

  const handleIncrement = ({ item, assetId }: IMultiProductCartHandleProps) => {
    const { parentName, metadata } = item;
    const label = metadata?.label;

    if (assetId && label && parentName) {
      dispatch(incrementMultiProductItem({ assetId, label, parentName }));
    }
  };

  const handleDecrement = ({ item, assetId }: IMultiProductCartHandleProps) => {
    const { parentName, metadata } = item;
    const label = metadata?.label;

    if (assetId && label && parentName) {
      dispatch(decrementMultiProductItem({ assetId, label, parentName }));
    }
  };

  const totalCount = useMemo(() => {
    return allItems.reduce((sum, item) => sum + (item.count ?? 0), 0);
  }, [allItems]);

  return (
    <div className='flex h-full flex-col '>
      <MultiProductCartHeader totalCount={totalCount} />
      <div className='flex flex-col h-full min-h-0'>
        <ul className='flex flex-col flex-1 min-h-0 overflow-y-auto'>
          {selectedProducts.map((product) => {
            const { items, name, assetId } = product;

            if (!items.length) return null;

            return (
              <>
                <div
                  key={product.value}
                  className=' p-[var(--sm-padding)] border-b border-[var(--border)]
        sm:px-[var(--sm-padding)]'
                >
                  {name}
                </div>
                <ul>
                  {items?.map((item) => {
                    return (
                      <CartListItem
                        key={`${item.value}/${item.parentName}`}
                        item={item}
                        canInc={totalCount < MAX_SLOTS}
                        onDelete={() => {
                          if (!assetId) return;
                          handleDelete({ item, assetId });
                        }}
                        onIncrement={() => {
                          if (!assetId) return;
                          handleIncrement({ item, assetId });
                        }}
                        onDecrement={() => {
                          if (!assetId) return;
                          handleDecrement({ item, assetId });
                        }}
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
            <CartPrice
              materials={allItems}
              containerStyles='flex flex-col gap-2 text-xs/snug p-[var(--sm-padding)] border-t border-solid border-[var(--border)]  sm:gap-3 sm:border-none'
            />
          </div>
          <div className='p-[var(--sm-padding)] border-t border-solid border-[var(--border)] shrink-0 sm:w-[50%] sm:border-none'>
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
