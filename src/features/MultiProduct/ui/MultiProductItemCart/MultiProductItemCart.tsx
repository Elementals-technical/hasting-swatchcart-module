import React from 'react';
import { useAppDispatch } from '../../../../app/store/store';
import {
  setIsOpenMultiProductCart,
  toggleSidebar,
} from '../../../swatches/model/swatchesSlice';
import { CartHeader } from '../../../Cart/ui/CartHeader/CartHeader';
import { CartList } from '../../../Cart/ui/CartList/CartList';
import { CartPrice } from '../../../Cart/ui/CartPrice/CartPrice';
import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';

interface IMultiProductItemCartProps {
  onSendData?: (data: unknown) => void;
}

export const MultiProductItemCart = ({
  onSendData,
}: IMultiProductItemCartProps) => {
  const dispatch = useAppDispatch();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleGoBack = () => {
    console.log('handleGoBack');

    dispatch(setIsOpenMultiProductCart(false));
  };

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <CartHeader
        onToggleSidebar={handleToggleSidebar}
        onSetActiveTab={handleGoBack}
      />
      <div className='flex flex-col h-full min-h-0'>
        <CartList />
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
