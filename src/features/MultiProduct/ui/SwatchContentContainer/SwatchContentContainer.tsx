import { CustomButton } from '../../../../shared/ui/CustomButton/CustomButton';
import { SwatchesList } from '../../../swatches/ui/SwatchesList/SwatchesList';

export const SwatchContentContainer = () => {
  const handleAddToCart = () => {
    console.log('handleAddToCart');
  };

  return (
    <div className='flex flex-col border-t border-[var(--border)]'>
      <SwatchesList containerStyles='flex flex-col p-[var(--sm-padding)] shrink-0' />
      <div className='p-[var(--sm-padding)] border-t border-[var(--border)]'>
        <CustomButton onClick={handleAddToCart}>
          ADD SWATCHES TO CART
        </CustomButton>
      </div>
    </div>
  );
};
