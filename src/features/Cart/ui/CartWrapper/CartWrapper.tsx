import { EActiveTab } from '../../../../shared/types/activeTab';
import CustomSidebar from '../../../../shared/ui/CustomSidebar/CustomSidebar';
import { useAppSelector } from '../../../../app/store/store';
import { CartHeader } from '../CartHeader/CartHeader';
import { CartPrice } from '../../../../shared/ui/CartPrice/CartPrice';
import { CartList } from '../CartList/CartList';
import { getCartItems } from '../../model/selectors';

interface ICartWrapperProps {
  isOpen: boolean;
  onSetActiveTab: (activeTab: EActiveTab) => void;
  onToggleSidebar: () => void;
  onSendData: (data: any[]) => void;
}

export const CartWrapper = ({
  isOpen,
  onToggleSidebar,
  onSetActiveTab,
  onSendData,
}: ICartWrapperProps) => {
  const cartItems = useAppSelector(getCartItems);
  const selectedMaterials = useAppSelector(getCartItems) ?? [];

  return (
    <CustomSidebar isOpen={isOpen} setIsOpen={onToggleSidebar}>
      <CartHeader
        onSetActiveTab={onSetActiveTab}
        onToggleSidebar={onToggleSidebar}
      />
      <div className='flex flex-col h-full min-h-0'>
        <CartList />
        <CartPrice materials={selectedMaterials} />
        <div className='p-[var(--padding)] border-t border-solid border-[var(--border)] shrink-0'>
          <button
            className='w-full bg-[var(--main-accent-color)] text-white py-3 rounded-full font-bold cursor-pointer'
            onClick={() => onSendData(cartItems)}
          >
            GO TO SHIPPING
          </button>
        </div>
      </div>
    </CustomSidebar>
  );
};
