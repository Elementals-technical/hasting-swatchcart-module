import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { setSelectedMaterials } from '../../../swatches/model/swatchesSlice';
import { CartPrice } from '../../../Cart/ui/CartPrice/CartPrice';
import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import { CartSelectedProductList } from '../CartSelectedProductList/CartSelectedProductList';
import {
  getActiveMultiCartProduct,
  getCartItems,
  getSelectedMaterials,
} from '../../model/selectors';
import { MultiProductCartService } from '../../lib/MultiProductCartServices';
import { useMemo } from 'react';
import type { ICartItem } from '../../model/types';
import {
  decrementMultiProductItem,
  incrementMultiProductItem,
  removeMultiProductItem,
} from '../../model/multiProductCartSlice';
import { CartListItem } from '../../../Cart/ui/CartListItem/CartListItem';
import { MultiProductCartHeader } from '../MultiProductCartHeader/MultiProductCartHeader';

interface IMultiProductItemCartProps {
  onSendData?: (data: unknown) => void;
}

export const MultiProductItemCart = ({
  onSendData,
}: IMultiProductItemCartProps) => {
  const dispatch = useAppDispatch();
  const selectedProduct = useAppSelector(getActiveMultiCartProduct);
  const selectedProducts = useAppSelector(getCartItems);

  const selectedMaterials = useAppSelector(
    getSelectedMaterials(selectedProduct?.productId || 999),
  );
  // console.log('selectedProducts', selectedProducts);
  // console.log('selectedMaterials', selectedMaterials);

  const totalCount = useMemo(() => {
    return MultiProductCartService.getCartTotalCount({
      cartItems: selectedMaterials,
    });
  }, [selectedMaterials]);

  const handleDelete = (item: ICartItem) => {
    const { parentName, metadata } = item;
    const productId = selectedProduct?.productId;
    const label = metadata.label;
    if (productId && label && parentName) {
      dispatch(removeMultiProductItem({ productId, label, parentName }));
      // DeleteSelected material from the  SwatchesList
      dispatch(setSelectedMaterials({ selectedMaterial: item }));
    }
  };

  const handleIncrement = (item: ICartItem) => {
    const { parentName, metadata } = item;
    const productId = selectedProduct?.productId;
    const label = metadata.label;
    // console.log('handleIncrement', item);
    // console.log('selectedMaterials', selectedMaterials);
    if (productId && label && parentName) {
      dispatch(incrementMultiProductItem({ productId, label, parentName }));
    }
  };

  const handleDecrement = (item: ICartItem) => {
    const { parentName, metadata } = item;
    const productId = selectedProduct?.productId;
    const label = metadata.label;
    // console.log('handleDecrement', item);
    // console.log('handleDecrement', selectedMaterials);
    if (productId && label && parentName) {
      dispatch(decrementMultiProductItem({ productId, label, parentName }));
    }
  };

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <MultiProductCartHeader />
      <CartSelectedProductList />
      <div className='flex flex-col h-full min-h-0'>
        <ul className='flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto py-[var(--sm-padding)] sm:gap-5'>
          {selectedMaterials?.map((item) => {
            return (
              <CartListItem
                key={`${item.assetId}/${item.parentName}`}
                item={item}
                canInc={totalCount < MAX_SLOTS}
                onDelete={handleDelete}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
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
            >
              GO TO SHIPPING
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};
