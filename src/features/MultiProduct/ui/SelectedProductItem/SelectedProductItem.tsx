import { useEffect } from 'react';
import { ArrowIconSVG } from '../../../../app/assets/svg/ArrowIconSVG';
// import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { getSelectedProduct } from '../../../swatches/model/selectors';
import { scrollToTop } from '../../../../shared/utils/scrollToTop';
import {
  clearAllMaterialFilters,
  deleteSelectedProduct,
} from '../../../swatches/model/swatchesSlice';
import { FiltersSelectedProductItem } from '../FiltersSelectedProductItem/FiltersSelectedProductItem';
import { MaterialMultiProductList } from '../MaterialMultiProductList/MaterialMultiProductList';
import { SwatchContentContainer } from '../SwatchContentContainer/SwatchContentContainer';

// interface ISelectedProductItemProps {
//   onSidebarToggle?: () => void;
// }

export const SelectedProductItem = () => {
  const dispatch = useAppDispatch();
  const selectedProduct = useAppSelector(getSelectedProduct);

  useEffect(() => {
    return () => {
      dispatch(clearAllMaterialFilters());
    };
  }, []);

  const handleGoBack = () => {
    dispatch(deleteSelectedProduct());
    scrollToTop();
  };

  return (
    <div className='flex flex-col h-full '>
      <header className='flex flex-row shrink-0 items-center justify-between border-b border-[var(--border)] p-[var(--sm-padding)]'>
        <div className='flex flex-row items-center gap-[8px]'>
          <button
            className='[&_svg_path]:stroke-[var(--main-accent-color)] cursor-pointer'
            onClick={handleGoBack}
          >
            <ArrowIconSVG />
          </button>
          <h2 className='m-0! text-[16px] font-medium leading-[1.6]'>
            {selectedProduct?.name}
          </h2>
        </div>
      </header>
      <div className='flex flex-col min-h-0 flex-1 '>
        <div className='shrink-0'>
          <FiltersSelectedProductItem />
        </div>

        <MaterialMultiProductList
          // containerStyles='flex-1 min-h-0 overflow-y-auto overscroll-contain p-[var(--sm-padding)]' // old scroll
          containerStyles='flex-1 min-h-0  p-[var(--sm-padding)]' // global scroll solution
          // gridStyles='grid grid-cols-2 gap-[16px] sm:grid-cols-4 sm:pb-[130px] lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9'
          gridStyles='grid grid-cols-2 gap-[16px] sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9'
          desktopColumnsCount={6}
        />

        <SwatchContentContainer />
      </div>
    </div>
  );
};
