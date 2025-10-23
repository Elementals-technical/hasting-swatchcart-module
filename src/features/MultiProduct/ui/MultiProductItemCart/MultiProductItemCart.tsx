import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  setIsOpenMultiProductCart,
  toggleSidebar,
} from '../../../swatches/model/swatchesSlice';
import { CartPrice } from '../../../Cart/ui/CartPrice/CartPrice';
import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { MAX_SLOTS } from '../../../../shared/constants/selectedMaterials';
import { ArrowIconSVG } from '../../../../app/assets/svg/ArrowIconSVG';
import { getSelectedProduct } from '../../../swatches/model/selectors';
import { getCartItems, getSelectedMaterials } from '../../model/selectors';

interface IMultiProductItemCartProps {
  onSendData?: (data: unknown) => void;
}

export const MultiProductItemCart = ({
  onSendData,
}: IMultiProductItemCartProps) => {
  const dispatch = useAppDispatch();
  const selectedProduct = useAppSelector(getSelectedProduct);
  const selectedProducts = useAppSelector(getCartItems);
  const selectedMaterials = useAppSelector(
    getSelectedMaterials(selectedProduct?.productId),
  );
  // const totalCount = useAppSelector(getCartTotalCount);
  const totalCount = 4;
  console.log('selectedProducts', selectedProducts);
  console.log('selectedMaterials', selectedMaterials);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleGoBack = () => {
    console.log('handleGoBack');

    dispatch(setIsOpenMultiProductCart(false));
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
      <div className='p-[var(--sm-padding)] border-b border-solid border-[var(--border)]'>
        slider
      </div>
      <div className='flex flex-col h-full min-h-0'>
        {/* <CartList /> */}
        <ul className='flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto py-[var(--padding)]  sm:py-[var(--sm-padding)] sm:gap-5'>
          {/* {selectedMaterials?.map((item) => {
            return (
              <CartListItem
                key={`${item.assetId}/${item.parentName}`}
                item={item}
              />
            );
          })} */}
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
          <li>7</li>
          <li>8</li>
          <li>9</li>
          <li>10</li>
          <li>11</li>
          <li>12</li>
          <li>13</li>
          <li>14</li>
          <li>15</li>
          <li>16</li>
          <li>17</li>
          <li>18</li>
          <li>19</li>
          <li>20</li>
        </ul>
        <CartPrice />
        <div className='p-[var(--padding)] border-t border-solid border-[var(--border)] shrink-0'>
          <CustomButton onClick={() => onSendData && onSendData('cartItems')}>
            GO TO SHIPPING
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
