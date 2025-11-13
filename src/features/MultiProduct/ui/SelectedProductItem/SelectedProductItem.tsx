import { useEffect } from 'react';
import { ArrowIconSVG } from '../../../../app/assets/svg/ArrowIconSVG';
// import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { getSelectedProduct } from '../../../swatches/model/selectors';
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
  };

  return (
    <div className='flex h-full flex-col'>
      <header className='flex shrink-0 items-center justify-between border-b border-[var(--border)] p-[var(--sm-padding)]'>
        <div className='flex items-center gap-2'>
          <button
            className='[&_svg_path]:stroke-[var(--main-accent-color)] cursor-pointer'
            onClick={handleGoBack}
          >
            <ArrowIconSVG />
          </button>
          <h2 className='m-0 text-base font-medium leading-[1.6]'>
            {selectedProduct?.name}
          </h2>
        </div>
      </header>
      <div className='flex min-h-0 flex-1 flex-col'>
        <div className='shrink-0 border-b border-[var(--border)]'>
          <FiltersSelectedProductItem />
        </div>

        <MaterialMultiProductList
          containerStyles='flex-1 min-h-0 overflow-y-auto overscroll-contain p-[var(--sm-padding)]'
          gridStyles='grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9'
          desktopColumnsCount={6}
        />

        <div className='shrink-0 border-t border-[var(--border)] shadow-[0_-2px_10px_rgba(40,40,40,0.10)]'>
          <SwatchContentContainer />
        </div>
      </div>
    </div>
  );
};
