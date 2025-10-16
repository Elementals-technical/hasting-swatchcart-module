import { EActiveTab } from '../../../../shared/types/activeTab';
import CustomSidebar from '../../../../shared/ui/CustomSidebar/CustomSidebar';
import { useAppSelector } from '../../../../app/store/store';
import { getSelectedMaterials } from '../../../swatches/model/selectors';
import { CartHeader } from '../CartHeader/CartHeader';

interface ICartWrapperProps {
  isOpen: boolean;
  onSetActiveTab: (activeTab: EActiveTab) => void;
  onToggleSidebar: () => void;
}

export const CartWrapper = ({
  isOpen,
  onToggleSidebar,
  onSetActiveTab,
}: ICartWrapperProps) => {
  const selectedMaterials = useAppSelector(getSelectedMaterials) ?? [];

  return (
    <CustomSidebar isOpen={isOpen} setIsOpen={onToggleSidebar}>
      <CartHeader
        onSetActiveTab={onSetActiveTab}
        onToggleSidebar={onToggleSidebar}
      />
      <div className='flex flex-col h-full min-h-0'>
        <div className='flex-1 min-h-0 overflow-y-auto py-[var(--padding)]  sm:py-[var(--sm-padding)]'>
          cart list
        </div>
        <div className='p-[var(--padding)]  sm:p-[var(--sm-padding)] border-t border-solid border-[var(--border)]'>
          total
        </div>
        <div className='p-[var(--padding)] border-t border-solid border-[var(--border)] shrink-0'>
          <button
            className='w-full bg-[var(--main-accent-color)] text-white py-3 rounded-full font-bold'
            onClick={() => console.log(selectedMaterials)}
          >
            GO TO SHIPPING
          </button>
        </div>
      </div>
    </CustomSidebar>
  );
};
