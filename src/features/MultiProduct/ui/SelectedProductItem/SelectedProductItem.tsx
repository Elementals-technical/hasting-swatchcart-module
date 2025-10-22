import { CloseIconSVG } from '../../../../app/assets/svg/CloseIconSVG';
import { MaterialList } from '../../../swatches/ui/MaterialList';
import { FiltersSelectedProductItem } from '../FiltersSelectedProductItem/FiltersSelectedProductItem';
import { SwatchContentContainer } from '../SwatchContentContainer/SwatchContentContainer';

interface ISelectedProductItemProps {
  onSidebarToggle: () => void;
}

export const SelectedProductItem = ({
  onSidebarToggle,
}: ISelectedProductItemProps) => {
  return (
    <div className='flex h-full flex-col'>
      <header className='flex items-center justify-between p-[var(--sm-padding)] border-b border-[var(--border)]'>
        <span className='text-base font-medium'>Selected Product</span>
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
          containerStyles='flex-1 min-h-0 overflow-y-auto p-[var(--sm-padding)]'
          gridStyles='grid grid-cols-2 gap-4 sm:grid-cols-6'
          desktopColumnsCount={6}
        />
        <SwatchContentContainer />
      </div>
    </div>
  );
};
