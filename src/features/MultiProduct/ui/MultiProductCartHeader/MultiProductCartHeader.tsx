import { useMemo } from 'react';
import { ArrowIconSVG } from '../../../../app/assets/svg/ArrowIconSVG';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  setIsOpenMultiProductCart,
  toggleSidebar,
} from '../../../swatches/model/swatchesSlice';
import {
  getActiveMultiCartProduct,
  getSelectedMaterials,
} from '../../model/selectors';
import { MultiProductCartService } from '../../lib/MultiProductCartServices';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';

export const MultiProductCartHeader = () => {
  const dispatch = useAppDispatch();
  const selectedProduct = useAppSelector(getActiveMultiCartProduct);

  const selectedMaterials = useAppSelector(
    getSelectedMaterials(selectedProduct?.productId || 999),
  );
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
  return (
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
  );
};
