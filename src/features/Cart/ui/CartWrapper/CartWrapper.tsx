import { EActiveTab } from '../../../../shared/types/activeTab';
import CustomSidebar from '../../../../shared/ui/CustomSidebar/CustomSidebar';
import { useAppSelector } from '../../../../app/store/store';
import { CartHeader } from '../CartHeader/CartHeader';
import { CartPrice } from '../../../../shared/ui/CartPrice/CartPrice';
import { CartList } from '../CartList/CartList';
import { getSelectedMaterials } from '../../../swatches/model/selectors';

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
  const selectedMaterials = useAppSelector(getSelectedMaterials) ?? [];

  return (
    <CustomSidebar isOpen={isOpen} setIsOpen={onToggleSidebar}>
      <CartHeader
        onSetActiveTab={onSetActiveTab}
        onToggleSidebar={onToggleSidebar}
      />
      <div className='flex flex-col h-full min-h-0'>
        <CartList />
        <CartPrice materials={selectedMaterials} />
        <div className='p-[var(--sm-padding)] border-t border-solid border-[var(--border)] shrink-0'>
          <button
            className='w-full bg-[var(--main-accent-color)] p-[1.25rem] hover:bg-secondary transition-all duration-200 text-white text-[14px] rounded-full font-bold cursor-pointer'
            onClick={() => onSendData(selectedMaterials)}
          >
            GO TO SHIPPING
          </button>
        </div>
      </div>
    </CustomSidebar>
  );
};
