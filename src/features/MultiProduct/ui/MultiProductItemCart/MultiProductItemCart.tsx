import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  setIsOpenMultiProductCart,
  setSelectedMaterials,
  toggleSidebar,
} from '../../../swatches/model/swatchesSlice';
import { CartPrice } from '../../../Cart/ui/CartPrice/CartPrice';
import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import { ArrowIconSVG } from '../../../../app/assets/svg/ArrowIconSVG';
import { CartSelectedProductList } from '../CartSelectedProductList/CartSelectedProductList';
import {
  getActiveMultiCartProduct,
  getCartItems,
  getSelectedMaterials,
} from '../../model/selectors';
import { MaterialItem } from '../../../../shared/ui/MaterialItem/MaterialItem';
import { Counter } from '../../../Cart/ui/Counter/Counter';
import { MultiProductCartService } from '../../lib/MultiProductCartServices';
import { useMemo } from 'react';
import type { ICartItem } from '../../model/types';
import {
  decrementMultiProductItem,
  incrementMultiProductItem,
  removeMultiProductItem,
} from '../../model/multiProductCartSlice';

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
  console.log('selectedProducts', selectedProducts);
  console.log('selectedMaterials', selectedMaterials);

  const totalCount = useMemo(() => {
    return MultiProductCartService.getCartTotalCount({
      cartItems: selectedMaterials,
    });
  }, [selectedMaterials]);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleGoBack = () => {
    dispatch(setIsOpenMultiProductCart(false));
  };

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
    console.log('handleIncrement', item);
    console.log('selectedMaterials', selectedMaterials);
    if (productId && label && parentName) {
      dispatch(incrementMultiProductItem({ productId, label, parentName }));
    }
  };

  const handleDecrement = (item: ICartItem) => {
    const { parentName, metadata } = item;
    const productId = selectedProduct?.productId;
    const label = metadata.label;
    console.log('handleDecrement', item);
    console.log('handleDecrement', selectedMaterials);
    if (productId && label && parentName) {
      dispatch(decrementMultiProductItem({ productId, label, parentName }));
    }
  };

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <header className='flex p-[var(--padding)] justify-between items-center border-b border-solid border-[var(--border)] sm:p-[var(--sm-padding)]'>
        <div className='flex items-center flex-row  gap-[4px]'>
          <div className='flex items-center gap-2'>
            <button
              className='[&_svg_path]:stroke-[var(--main-accent-color)] cursor-pointer'
              onClick={handleGoBack}
            >
              <ArrowIconSVG />
            </button>
            <h2 className='m-0 text-base leading-[1.6] font-medium '>
              Your cart
            </h2>
          </div>
          {totalCount >= MAX_SLOTS ? (
            <>
              <span className='text-[var(--main-accent-color)] hidden text-xs sm:block'>
                ({MAX_SLOTS}) You reached maximum amount of swatches
              </span>
              <span className='text-[var(--main-accent-color)] block sm:hidden'>
                ({MAX_SLOTS}) Max
              </span>
            </>
          ) : null}
        </div>
        <button
          className='flex justify-center items-center w-[30px] h-[30px] bg-[var(--background-grey)]
              border-none cursor-pointer rounded-full
              [&_svg_path]:stroke-[var(--svg-dark)]'
          onClick={handleToggleSidebar}
        >
          <CloseIconSVG width={10} height={10} />
        </button>
      </header>
      <CartSelectedProductList />
      <div className='flex flex-col h-full min-h-0'>
        <ul className='flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto py-[var(--sm-padding)] sm:gap-5'>
          {selectedMaterials?.map((item) => {
            return (
              // <CartListItem
              //   key={`${item.assetId}/${item.parentName}`}
              //   item={item}
              // />
              <li
                key={`${item.assetId}/${item.parentName}`}
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
                      <span className='mb-1 font-medium'>
                        {item.metadata.label}
                      </span>
                      <span className='mb-1 font-semibold'>
                        {item.parentName}
                      </span>
                    </div>
                    <Counter
                      value={item.count}
                      canIncrement={totalCount < MAX_SLOTS}
                      onIncrement={() => handleIncrement(item)}
                      onDecrement={() => handleDecrement(item)}
                      onDelete={() => handleDelete(item)}
                    />
                  </div>
                  <div className='absolute top-0 right-0'>$13.00</div>
                </div>
              </li>
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
