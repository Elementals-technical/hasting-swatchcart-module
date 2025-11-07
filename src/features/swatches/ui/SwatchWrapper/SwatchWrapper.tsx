import { ProductElement } from '../ProductElement';
import { Filters } from '../Filters';
import { EActiveTab } from '../../../../shared/types/activeTab';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import CustomSidebar from '../../../../shared/ui/CustomSidebar/CustomSidebar';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import {
  getIsLoadingSelectedProduct,
  getSelectedMaterials,
} from '../../model/selectors';
import { CartCervices } from '../../../Cart/lib/CartCervices';
import { setCartItems } from '../../../Cart/model/cartSlice';
import { SwatchesSingleProductListWrapper } from '../SwatchesListWrapper/SwatchesListWrapper';
import { MaterialSingleProductList } from '../MaterialSingleProductList/MaterialSingleProductList';
import { Loader } from '../../../../shared/ui/Loader/Loader';

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
  const dispatch = useAppDispatch();
  const selectedMaterials = useAppSelector(getSelectedMaterials) ?? [];
  const isLoading = useAppSelector(getIsLoadingSelectedProduct);
  // const isLoading = true;

  const handleOpenCart = () => {
    const cartData = CartCervices.getCartPreparedOption(selectedMaterials);

    if (cartData) {
      dispatch(setCartItems(cartData));
    }
    onSetActiveTab(EActiveTab.CART);
  };

  return (
    <CustomSidebar isOpen={isOpen} setIsOpen={onToggleSidebar}>
      <header className='flex p-[var(--sm-padding)] justify-between items-center border-b border-solid border-[var(--border)]'>
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
      <div className='flex flex-col h-full min-h-0 relative'>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center backdrop-blur-md bg-black/2 z-50'>
            <Loader />
          </div>
        )}

        <ProductElement
          containerStyles='flex justify-between items-center shrink-0 p-[var(--sm-padding)] border-b border-solid border-[var(--border)]'
          selectStyles='min-w-[auto] max-w-[154px] sm:max-w-[auto] sm:min-w-[250px]'
        />
        <Filters containerStyles='shrink-0 flex justify-between items-center gap-1 p-[var(--sm-padding)] border-b border-solid border-[var(--border)]' />
        <MaterialSingleProductList />
        <SwatchesSingleProductListWrapper />

        <div className='p-[var(--sm-padding)] border-t border-solid border-[var(--border)] shrink-0'>
          <button
            className='w-full bg-[var(--main-accent-color)] text-white py-3 rounded-full font-bold cursor-pointer'
            onClick={handleOpenCart}
          >
            ADD SWATCHES TO CART
          </button>
        </div>
      </div>
    </CustomSidebar>
  );
};
