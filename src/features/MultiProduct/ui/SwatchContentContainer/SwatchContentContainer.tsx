import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';
import { CartCervices } from '../../../Cart/lib/CartCervices';
import { setCartItems } from '../../../Cart/model/cartSlice';
import { getSelectedMaterials } from '../../../swatches/model/selectors';
import { setIsOpenMultiProductCart } from '../../../swatches/model/swatchesSlice';
import { SwatchesList } from '../../../swatches/ui/SwatchesList/SwatchesList';

export const SwatchContentContainer = () => {
  const dispatch = useAppDispatch();
  const selectedMaterials = useAppSelector(getSelectedMaterials) ?? [];

  const handleOpenMultiCart = () => {
    const cartData = CartCervices.getCartPreparedOption(selectedMaterials);

    if (cartData) {
      dispatch(setCartItems(cartData));
    }
    dispatch(setIsOpenMultiProductCart(true));
  };

  return (
    <div
      className='flex flex-col border-t border-[var(--border)]
      sm:flex-row
    '
    >
      <SwatchesList containerStyles='flex flex-col p-[var(--sm-padding)] shrink-0 sm:w-[50%] sm:border-r sm:border-[var(--border)]' />
      <div className='flex p-[var(--sm-padding)] border-t border-[var(--border)] sm:border-none sm:w-[50%] sm:justify-center sm:items-center'>
        <CustomButton onClick={handleOpenMultiCart}>
          ADD SWATCHES TO CART
        </CustomButton>
      </div>
    </div>
  );
};
