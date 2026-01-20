import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { setSelectedMaterial } from '../../../swatches/model/swatchesSlice';
import { CartPrice } from '../../../../shared/ui/CartPrice/CartPrice';
import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';

import { Fragment, useMemo, useState } from 'react';
import type { IMultiProductCartHandleProps } from '../../model/types';
import {
  decrementMultiProductItem,
  incrementMultiProductItem,
  removeMultiProductItem,
} from '../../model/multiProductCartSlice';
import { CartListItem } from '../../../Cart/ui/CartListItem/CartListItem';
import { MultiProductCartHeader } from '../MultiProductCartHeader/MultiProductCartHeader';
import { getSelectedMaterials } from '../../../swatches/model/selectors';
import { useCartCount } from '../../../swatches/utils/hooks/useCartCount';
import { getMultiCartItems } from '../../model/selectors';
import { SwatchLimitModal } from '../../../../shared/ui/SwatchLimitModal/SwatchLimitModal';

/**
 * Props for {@link MultiProductItemCart}.
 */
interface IMultiProductItemCartProps {
  /**
   * Optional callback fired when user proceeds to shipping.
   * Receives the current selected products payload.
   */
  onSendData?: (data: unknown) => void;
}

/**
 * Renders a multi-product cart with grouped items, quantity controls, and totals.
 *
 * Features:
 * - grouped rendering by product
 * - increment/decrement/delete actions for cart items
 * - synchronizes deletion with the swatches selected materials state
 * - shows totals and a "Go to shipping" action
 *
 * @component
 *
 * @param props - {@link IMultiProductItemCartProps}
 */

export const MultiProductItemCart = ({
  onSendData,
}: IMultiProductItemCartProps) => {
  const dispatch = useAppDispatch();
  const selectedProducts = useAppSelector(getMultiCartItems);
  const selectedMaterials = useAppSelector(getSelectedMaterials);
  const [isShowLimitMessage, setIsShowLimitMessage] = useState(false);

  /**
   * Flattens product groups into a single items list used for totals and pricing.
   */
  const allItems = useMemo(() => {
    return selectedProducts.flatMap((p) => p.items);
  }, [selectedProducts]);

  /**
   * Removes an item from the multi-product cart and updates swatches selection state.
   *
   * @param params - Cart action payload containing the item and product asset id
   */
  const handleDelete = ({ item, assetId }: IMultiProductCartHandleProps) => {
    const { parentName, metadata } = item;
    const label = metadata?.label;

    if (assetId && label && parentName) {
      dispatch(removeMultiProductItem({ assetId, label, parentName }));

      dispatch(
        setSelectedMaterial({
          selectedMaterial: item,
          materialCount: 1,
          selectedMaterials,
        }),
      );
    }
  };

  /**
   * Increments an item count in the multi-product cart.
   *
   * @param params - Cart action payload containing the item and product asset id
   */
  const handleIncrement = ({ item, assetId }: IMultiProductCartHandleProps) => {
    const { parentName, metadata } = item;
    const label = metadata?.label;

    if (item.count + 1 === 3) {
      setIsShowLimitMessage(true);
    } else {
      if (assetId && label && parentName) {
        dispatch(incrementMultiProductItem({ assetId, label, parentName }));
      }
    }
  };

  /**
   * Decrements an item count in the multi-product cart.
   *
   * @param params - Cart action payload containing the item and product asset id
   */
  const handleDecrement = ({ item, assetId }: IMultiProductCartHandleProps) => {
    const { parentName, metadata } = item;
    const label = metadata?.label;

    if (assetId && label && parentName) {
      dispatch(decrementMultiProductItem({ assetId, label, parentName }));
    }
  };

  const totalCount = useCartCount(allItems);

  return (
    <>
      <div className='flex flex-col h-full'>
        <MultiProductCartHeader totalCount={totalCount} />

        <div className='flex flex-col h-full min-h-0'>
          <ul className='flex flex-col flex-1 min-h-0 overflow-y-auto'>
            {selectedProducts.map((product) => {
              const { items, name, assetId } = product;

              if (!items.length) return null;

              return (
                <Fragment key={product.assetId}>
                  <div
                    className=' p-[var(--sm-padding)] border-y border-[var(--border)]
                    sm:px-[var(--sm-padding)] text-[14px] font-medium'
                  >
                    {name}
                  </div>

                  <ul>
                    {items?.map((item) => (
                      <CartListItem
                        key={`${item.value}/${product.assetId}`}
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
                    ))}
                  </ul>
                </Fragment>
              );
            })}
          </ul>

          <div
            className='flex flex-col 
          sm:flex-row sm:w-full sm:justify-between sm:items-center
          sm:border-t sm:border-[var(--border)] shadow-[0_-2px_10px_rgba(40,40,40,0.10)]
        '
          >
            <div className='sm:w-[50%] sm:border-r sm:border-solid sm:border-[var(--border)]'>
              <CartPrice
                materials={allItems}
                containerStyles='flex flex-col gap-[8px] text-[12px]/snug p-[var(--sm-padding)] border-t border-solid border-[var(--border)]  sm:gap-[12px] sm:border-none s'
              />
            </div>

            <div className='p-[var(--sm-padding)] border-t border-solid border-[var(--border)] shrink-0 sm:w-[50%] sm:border-none sm:flex flex-row sm:justify-end sm:items-end sm:h-full'>
              <div className='sm:w-[50%] text-[14px]'>
                <CustomButton
                  onClick={() =>
                    onSendData &&
                    onSendData(
                      selectedProducts.filter(
                        (product) => product.items.length,
                      ),
                    )
                  }
                  disabled={allItems.length > MAX_SLOTS + 1}
                >
                  GO TO SHIPPING
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SwatchLimitModal
        body='A maximum of two swatches per material may be ordered.'
        isOpen={isShowLimitMessage}
        onClose={() => setIsShowLimitMessage(false)}
      />
    </>
  );
};
