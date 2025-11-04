import { ArrowIconSVG } from '../../../../app/assets/svg/ArrowIconSVG';
import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { useAppDispatch, useAppSelector } from '../../../../app/store/store';
import { getSelectedProduct } from '../../../swatches/model/selectors';
import { deleteSelectedProduct } from '../../../swatches/model/swatchesSlice';
import { MaterialList } from '../../../swatches/ui/MaterialList';
import { FiltersSelectedProductItem } from '../FiltersSelectedProductItem/FiltersSelectedProductItem';
import { SwatchContentContainer } from '../SwatchContentContainer/SwatchContentContainer';

interface ISelectedProductItemProps {
  onSidebarToggle: () => void;
}

export const SelectedProductItem = ({
  onSidebarToggle,
}: ISelectedProductItemProps) => {
  const dispatch = useAppDispatch();
  const selectedProduct = useAppSelector(getSelectedProduct);

  const handleGoBack = () => {
    dispatch(deleteSelectedProduct());
  };

  return (
    <div className='flex h-full flex-col'>
      <header className='flex items-center justify-between p-[var(--sm-padding)] border-b border-[var(--border)]'>
        <div className='flex items-center gap-2'>
          <button
            className='[&_svg_path]:stroke-[var(--main-accent-color)] cursor-pointer'
            onClick={handleGoBack}
          >
            <ArrowIconSVG />
          </button>
          <h2 className='m-0 text-base leading-[1.6] font-medium '>
            {selectedProduct?.name}
          </h2>
        </div>
        <button
          onClick={onSidebarToggle}
          className='flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--background-grey)]
                      [&_svg_path]:stroke-[var(--svg-dark)]'
        >
          <CloseIconSVG width={10} height={10} />
        </button>
      </header>
      <div className='flex min-h-0 flex-1 flex-col'>
        <FiltersSelectedProductItem />
        <MaterialList
          containerStyles='flex-1 max-h-50 overflow-y-auto p-[var(--sm-padding)] md:max-h-94'
          // containerStyles='flex-1 overflow-y-auto p-[var(--sm-padding)]'
          gridStyles='grid grid-cols-2 gap-4 sm:grid-cols-8'
          desktopColumnsCount={6}
        />
        <div className=''>
          <SwatchContentContainer />
        </div>
      </div>
    </div>
  );
};
