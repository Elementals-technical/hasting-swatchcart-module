import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';
import { CartCervices } from '../../../Cart/lib/CartCervices';
import {
  getSelectedMaterials,
  getSelectedProduct,
} from '../../../swatches/model/selectors';
import { setIsOpenMultiProductCart } from '../../../swatches/model/swatchesSlice';
import { SwatchesList } from '../../../swatches/ui/SwatchesList/SwatchesList';
import {
  setActiveMultiCartProduct,
  setCartItems,
} from '../../model/multiProductCartSlice';
import { getCartItems } from '../../model/selectors';

export const SwatchContentContainer = () => {
  const dispatch = useAppDispatch();
  const selectedMaterials = useAppSelector(getSelectedMaterials) ?? [];
  const selectedProduct = useAppSelector(getSelectedProduct);
  const cartItems = useAppSelector(getCartItems);

  const handleOpenMultiCart = () => {
    const cartData = CartCervices.getCartPreparedOption(
      selectedMaterials,
      cartItems,
    );

    if (selectedProduct) {
      const cartProductItem = {
        productId: selectedProduct.productId,
        name: selectedProduct.name,
        items: cartData,
      };

      dispatch(setCartItems(cartProductItem));
      dispatch(setIsOpenMultiProductCart(true));
      dispatch(setActiveMultiCartProduct(cartProductItem));
    }
  };

  return (
    <div
      className='flex flex-col border-t border-[var(--border)]
      sm:flex-row
    '
    >
      <SwatchesList containerStyles='flex flex-col p-[var(--sm-padding)] shrink-0 sm:w-[50%] sm:border-r sm:border-[var(--border)]' />
      <div className='flex p-[var(--sm-padding)] border-t border-[var(--border)] sm:border-none sm:w-[50%] sm:justify-center sm:items-center'>
        <CustomButton
          onClick={handleOpenMultiCart}
          // disabled={!selectedMaterials.length}
        >
          ADD SWATCHES TO CART
        </CustomButton>
      </div>
    </div>
  );
};
