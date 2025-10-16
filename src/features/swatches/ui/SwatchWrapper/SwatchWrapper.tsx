import { ProductElement } from '../ProductElement';
import { Filters } from '../Filters';
import { MaterialList } from '../MaterialList';
import { SwatchesList } from '../SwatchesList/SwatchesList';
import { EActiveTab } from '../../../../shared/types/activeTab';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import CustomSidebar from '../../../../shared/ui/CustomSidebar/CustomSidebar';

interface ISidebarWrapperProps {
  isOpen: boolean;
  onSetActiveTab: (activeTab: EActiveTab) => void;
  onToggleSidebar: () => void;
}

export const SwatchWrapper = ({
  isOpen,
  onToggleSidebar,
  onSetActiveTab,
}: ISidebarWrapperProps) => {
  return (
    <CustomSidebar isOpen={isOpen} setIsOpen={onToggleSidebar}>
      <header className='flex p-[var(--padding)] justify-between items-center border-b border-solid border-[var(--border)] sm:p-[var(--sm-padding)]'>
        <h2 className='m-0 text-[16px] leading-[1.6] font-medium'>
          Order free swatches
        </h2>
        <button
          className='flex justify-center items-center w-[30px] h-[30px] bg-[var(--background-grey)]
              border-none cursor-pointer rounded-full
              [&_svg_path]:stroke-[var(--svg-dark)]'
          onClick={onToggleSidebar}
        >
          <CloseIconSVG width={10} height={10} />
        </button>
      </header>
      <div className='flex flex-col h-full min-h-0'>
        <ProductElement />
        <Filters />
        <MaterialList />
        <SwatchesList />
        <div className='p-[var(--padding)] border-t border-solid border-[var(--border)] shrink-0'>
          <button
            className='w-full bg-[var(--main-accent-color)] text-white py-3 rounded-full font-bold'
            onClick={() => onSetActiveTab(EActiveTab.CART)}
          >
            ADD SWATCHES TO CART
          </button>
        </div>
      </div>
    </CustomSidebar>
  );
};
